/**
 * ChatGPT Sidebar — Google Docs Add-on (Apps Script)
 * Source of truth is maintained in GitHub. Copy into Apps Script project for testing.
 *
 * NOTE: This is a placeholder. Replace with generated bundle output from Grok.
 */
function onOpen() {
  DocumentApp.getUi()
    .createMenu('ChatGPT Sidebar')
    .addItem('Sidebar öffnen', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('ChatGPT Sidebar');
  DocumentApp.getUi().showSidebar(html);
}
