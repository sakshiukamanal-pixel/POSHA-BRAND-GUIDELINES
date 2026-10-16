/** @OnlyCurrentDoc  Limits access to this one spreadsheet, not all of your Google Sheets. */

/**
 * Posha Brand Guidelines → Feedback sheet
 *
 * Receives the site's Feedback form and adds one row per submission.
 * Setup (once, signed in with your Posha Google account):
 *   1. Create a Google Sheet, e.g. "Brand Guidelines Feedback".
 *   2. Extensions → Apps Script. Delete the sample code, paste this whole file, Save.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as: Me    ·    Who has access: Anyone
 *      Approve the permissions it asks for (it only touches this sheet).
 *   4. Copy the Web app URL (ends in /exec) into database/site.js → feedback.endpoint.
 * After editing this script later, use Deploy → Manage deployments → Edit → New version,
 * so the same URL keeps working.
 *
 * Backup copy in the project (code/tools/pull-feedback.py): Project Settings → Script properties →
 * add EXPORT_KEY with the same value as FEEDBACK_EXPORT_KEY in the project's .env. The key never
 * goes in this file, because the repository is public.
 */

const SHEET_NAME = 'Feedback';
const HEADERS = ['Received', 'Name', 'Email', 'Feedback', 'Page'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'export') return exportRows(p.key);
  // Bots fill every field; people never see this one
  if (p.website) return reply({ ok: true });

  const name = clean(p.name, 120);
  const email = clean(p.email, 200);
  const feedback = clean(p.feedback, 5000);
  if (!feedback) return reply({ ok: false, error: 'Feedback is empty' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    sheet.appendRow([new Date(), name, email, feedback, clean(p.page, 500)]);
  } finally {
    lock.releaseLock();
  }
  return reply({ ok: true });
}

// Every row as JSON, only for a caller holding the export key (the project's backup script)
function exportRows(key) {
  const expected = PropertiesService.getScriptProperties().getProperty('EXPORT_KEY');
  if (!expected || key !== expected) return reply({ ok: false, error: 'Not allowed' });
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const values = sheet ? sheet.getDataRange().getValues() : [HEADERS];
  const rows = values.slice(1).map((r) => r.map((v) => (v instanceof Date ? v.toISOString() : v)));
  return reply({ ok: true, headers: values[0], rows: rows });
}

// Visiting the URL in a browser just confirms it's live
function doGet() {
  return reply({ ok: true, info: 'Posha brand guidelines feedback endpoint' });
}

// Keeps cells plain text: trims, caps length, and stops a leading = + - @ being read as a formula
function clean(v, max) {
  const s = String(v || '').trim().slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
