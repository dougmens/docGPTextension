/**
 * @OnlyCurrentDoc
 */

function onOpen() {
  DocumentApp.getUi()
    .createMenu('ChatGPT Sidebar')
    .addItem('Sidebar öffnen', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('ChatGPT Sidebar')
    .setWidth(400);
  DocumentApp.getUi().showSidebar(html);
}

/**
 * API-Key aus Script Properties lesen
 */
function getApiKey() {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error(
      'Kein OpenAI API-Key hinterlegt. Bitte in den Script-Eigenschaften den Schlüssel OPENAI_API_KEY setzen.'
    );
  }
  return apiKey;
}

/**
 * Markierten Text holen
 */
function getSelectionText() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  if (!selection) return '';

  const elements = selection.getRangeElements();
  let parts = [];

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (el.isPartial()) {
      const textEl = el.getElement().asText();
      const start = el.getStartOffset();
      const end = el.getEndOffsetInclusive();
      parts.push(textEl.getText().substring(start, end + 1));
    } else {
      const element = el.getElement();
      const type = element.getType();
      if (
        type === DocumentApp.ElementType.PARAGRAPH ||
        type === DocumentApp.ElementType.LIST_ITEM ||
        type === DocumentApp.ElementType.TABLE_CELL
      ) {
        parts.push(element.asText().getText());
      }
    }
  }

  return parts.join('\n\n');
}

/**
 * Gesamten Dokumenttext holen
 */
function getDocumentText() {
  return DocumentApp.getActiveDocument().getBody().getText();
}

/**
 * Text an Cursor einfügen
 */
function insertAtCursor(text) {
  const cursor = DocumentApp.getActiveDocument().getCursor();
  if (!cursor) {
    throw new Error('Kein Cursor gefunden. Bitte setzen Sie den Cursor.');
  }
  cursor.insertText(text);
}

/**
 * Markierten Text sicher ersetzen
 */
function replaceSelection(text) {
  const doc = DocumentApp.getActiveDocument();
  const selection = doc.getSelection();
  if (!selection) {
    throw new Error('Kein Text markiert.');
  }

  const elements = selection.getRangeElements();
  let replaced = false;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    if (el.isPartial()) {
      const textEl = el.getElement().asText();
      const start = el.getStartOffset();
      const end = el.getEndOffsetInclusive();
      textEl.deleteText(start, end);
      textEl.insertText(start, text);
      replaced = true;
    } else {
      const element = el.getElement();
      const type = element.getType();
      if (
        type === DocumentApp.ElementType.PARAGRAPH ||
        type === DocumentApp.ElementType.LIST_ITEM ||
        type === DocumentApp.ElementType.TABLE_CELL
      ) {
        element.asText().setText(text);
        replaced = true;
      }
    }
  }

  if (!replaced) {
    throw new Error('Markierter Bereich konnte nicht ersetzt werden.');
  }
}

/**
 * Gesamtes Dokument ersetzen
 */
function replaceWholeDocument(text) {
  const body = DocumentApp.getActiveDocument().getBody();
  body.clear();
  body.setText(text);
}

/**
 * OpenAI API Call
 */
function callOpenAI(payload) {
  const apiKey = getApiKey();

  const response = UrlFetchApp.fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }
  );

  const code = response.getResponseCode();
  if (code !== 200) {
    let msg = 'OpenAI API Fehler (' + code + ')';
    try {
      const json = JSON.parse(response.getContentText());
      if (json.error && json.error.message) {
        msg += ': ' + json.error.message;
      }
    } catch (e) {
      msg += ': ' + response.getContentText();
    }
    throw new Error(msg);
  }

  return JSON.parse(response.getContentText());
}

/**
 * Messages bauen (Kontext wird übergeben)
 */
function buildMessages(userMessage, mode, contextText) {
  let systemPrompt;

  if (mode === 'Schriftsatz') {
    systemPrompt =
      'Du bist ein deutscher Jurist. Erstelle einen Schriftsatz-Entwurf auf Deutsch. ' +
      'Nutze klare Gliederung. Erfinde keine Fakten. ' +
      'Fehlende Angaben mit [BITTE ERGÄNZEN] kennzeichnen.';
  } else if (mode === 'Überarbeiten') {
    systemPrompt =
      'Du bist Lektor. Überarbeite den Text, verbessere Klarheit und Stil, ' +
      'ohne den Sinn zu verändern. Antworte nur mit dem überarbeiteten Text.';
  } else {
    systemPrompt = 'Du bist ein hilfreicher Assistent. Antworte präzise und strukturiert.';
  }

  let messages = [{ role: 'system', content: systemPrompt }];

  let content = userMessage;
  if (contextText && contextText.trim()) {
    content = '=== Kontext ===\n' + contextText + '\n\n' + userMessage;
  }

  messages.push({ role: 'user', content: content });
  return messages;
}

/**
 * Haupteinstieg vom Sidebar-Client
 */
function processChatRequest(data) {
  try {
    const message = data.message;
    const mode = data.mode;
    const contextMode = data.contextMode;

    if (!message || !message.trim()) {
      throw new Error('Bitte eine Nachricht eingeben.');
    }

    let contextText = '';

    if (contextMode === 'Mit Markierung') {
      contextText = getSelectionText();
      if (!contextText.trim()) {
        throw new Error('Keine Textstelle markiert.');
      }
    } else if (contextMode === 'Mit ganzem Dokument') {
      contextText = getDocumentText();
    }

    let charCount = (contextText + message).length;
    let truncated = false;

    if (charCount > 60000) {
      const maxContext = 60000 - message.length - 100;
      contextText = contextText.slice(-maxContext);
      charCount = contextText.length + message.length;
      truncated = true;
    }

    const messages = buildMessages(message, mode, contextText);

    const payload = {
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: mode === 'Überarbeiten' ? 0.3 : 0.7,
      max_tokens: 4000
    };

    const result = callOpenAI(payload);
    const answer = result.choices[0].message.content.trim();

    return {
      success: true,
      answer: answer,
      charCount: charCount,
      truncated: truncated
    };

  } catch (error) {
    return {
      success: false,
      error: error.message || 'Unbekannter Fehler'
    };
  }
}
