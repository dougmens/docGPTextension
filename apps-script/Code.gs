/**

@OnlyCurrentDoc
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

Liest den API-Key aus den Script Properties
*/
function getApiKey() {
const properties = PropertiesService.getScriptProperties();
const apiKey = properties.getProperty('OPENAI_API_KEY');
if (!apiKey) {
throw new Error('Kein OpenAI API-Key hinterlegt. Bitte in den Script-Eigenschaften den Schlüssel OPENAI_API_KEY setzen.');
}
return apiKey;
}

/**

Holt den aktuell markierten Text
@returns {string} markierter Text oder leerer String
*/
function getSelectionText() {
const selection = DocumentApp.getActiveDocument().getSelection();
if (!selection) return '';

let text = [];
const elements = selection.getRangeElements();
for (let i = 0; i < elements.length; i++) {
const element = elements[i];
if (element.isPartial()) {
const start = element.getStartOffset();
const end = element.getEndOffsetInclusive();
const content = element.getElement().asText().getText();
text.push(content.substring(start, end + 1));
} else {
const elementType = element.getElement().getType();
if (elementType === DocumentApp.ElementType.PARAGRAPH ||
elementType === DocumentApp.ElementType.TABLE_CELL ||
elementType === DocumentApp.ElementType.LIST_ITEM) {
text.push(element.getElement().asText().getText());
}
}
}
return text.join('\n\n');
}
/**

Holt den gesamten Dokumenttext
@returns {string}
*/
function getDocumentText() {
const body = DocumentApp.getActiveDocument().getBody();
return body.getText();
}

/**

Fügt Text an der aktuellen Cursor-Position ein
@param {string} text
*/
function insertAtCursor(text) {
const doc = DocumentApp.getActiveDocument();
const cursor = doc.getCursor();
if (cursor) {
cursor.insertText(text);
} else {
throw new Error('Kein Cursor gefunden. Bitte setzen Sie den Cursor an die gewünschte Stelle.');
}
}

/**

Ersetzt den aktuell markierten Text
@param {string} text
*/
function replaceSelection(text) {
const selection = DocumentApp.getActiveDocument().getSelection();
if (!selection) {
throw new Error('Kein Text markiert. Bitte markieren Sie den Text, den Sie ersetzen möchten.');
}

const elements = selection.getRangeElements();
let first = true;
for (let i = 0; i < elements.length; i++) {
const element = elements[i];
if (element.isPartial()) {
const textElement = element.getElement().asText();
const start = element.getStartOffset();
const end = element.getEndOffsetInclusive();
if (first) {
textElement.editAsText().deleteText(start, end);
textElement.editAsText().insertText(start, text);
first = false;
} else {
textElement.editAsText().deleteText(start, end);
}
} else {
const container = element.getElement();
if (first) {
container.clear();
container.asParagraph().setText(text);
first = false;
} else {
container.removeFromParent();
}
}
}
}
/**

Ersetzt den gesamten Dokumentinhalt (mit Vorsicht)
@param {string} text
*/
function replaceWholeDocument(text) {
const body = DocumentApp.getActiveDocument().getBody();
body.clear();
body.setText(text);
}

/**

Hauptfunktion: Anfrage an OpenAI senden
@param {Object} payload
@returns {Object}
*/
function callOpenAI(payload) {
const apiKey = getApiKey();
const url = 'https://api.openai.com/v1/chat/completions';

const options = {
method: 'post',
contentType: 'application/json',
headers: {
Authorization: Bearer ${apiKey}
},
payload: JSON.stringify(payload),
muteHttpExceptions: true
};
const response = UrlFetchApp.fetch(url, options);
const code = response.getResponseCode();
if (code !== 200) {
let errorMsg = OpenAI API Fehler (${code});
try {
const json = JSON.parse(response.getContentText());
errorMsg += ': ' + (json.error?.message || 'Unbekannter Fehler');
} catch (e) {
errorMsg += ': ' + response.getContentText();
}
throw new Error(errorMsg);
}
return JSON.parse(response.getContentText());
}
/**

Baut die Nachrichten für die OpenAI API
@param {string} userMessage
@param {string} mode
@param {string} contextMode
@returns {Array} messages array
*/
function buildMessages(userMessage, mode, contextMode) {
let systemPrompt = '';

switch (mode) {
case 'Schriftsatz':
systemPrompt = 'Du bist ein deutscher Jurist. Erstelle einen Schriftsatz-Entwurf auf Deutsch. ' +
'Nutze klare Gliederung. Erfinde keine Fakten. ' +
'Fehlende Angaben mit [BITTE ERGÄNZEN] kennzeichnen.';
break;
case 'Überarbeiten':
systemPrompt = 'Du bist Lektor. Überarbeite den Text, verbessere Klarheit und Stil, ' +
'ohne den Sinn zu verändern. Antworte nur mit dem überarbeiteten Text.';
break;
case 'Allgemein':
default:
systemPrompt = 'Du bist ein hilfreicher Assistent. Antworte präzise und strukturiert.';
}
const messages = [
{ role: 'system', content: systemPrompt }
];
let contextText = '';
let contextInfo = '';
if (contextMode === 'Mit Markierung') {
contextText = getSelectionText();
if (!contextText.trim()) {
throw new Error('Keine Textstelle markiert.');
}
contextInfo = '=== Markierter Text ===\n' + contextText;
} else if (contextMode === 'Mit ganzem Dokument') {
contextText = getDocumentText();
contextInfo = '=== Gesamtes Dokument ===\n' + contextText;
}
let finalUserContent = userMessage;
if (contextInfo) {
finalUserContent = contextInfo + '\n\n' + userMessage;
}
messages.push({ role: 'user', content: finalUserContent });
return messages;
}
/**

Hauptfunktion, die vom Client aufgerufen wird
@param {Object} data
@returns {Object}
*/
function processChatRequest(data) {
try {
const { message, mode, contextMode } = data;if (!message || !message.trim()) {
throw new Error('Bitte eine Nachricht eingeben.');
}let contextText = '';
if (contextMode === 'Mit Markierung') {
contextText = getSelectionText();
} else if (contextMode === 'Mit ganzem Dokument') {
contextText = getDocumentText();
}let charCount = (contextText + message).length;
let truncated = false;if (charCount > 60000) {
const maxContext = 60000 - message.length - 100;
contextText = contextText.slice(-maxContext);
charCount = contextText.length + message.length;
truncated = true;
}const messages = buildMessages(message, mode, contextMode);const payload = {
model: 'gpt-4o-mini',
messages: messages,
temperature: mode === 'Überarbeiten' ? 0.3 : 0.7,
max_tokens: 4000
};const result = callOpenAI(payload);
const answer = result.choices[0].message.content.trim();return {
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