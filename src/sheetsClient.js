// Google Sheets client - reads the Content Calendar, updates status cells.
// Auth: service-account JSON key (share the sheet with its client_email).
import { google } from "googleapis";

// Expected sheet columns (row 1 = headers):
// Date | Time | Platform | Caption | Media URL | Status | Buffer Post ID | Notes
export const COLS = ["Date", "Time", "Platform", "Caption", "Media URL", "Status", "Buffer Post ID", "Notes"];

async function sheetsApi() {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_CREDENTIALS_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

const tab = () => process.env.GOOGLE_SHEET_TAB || "Content Calendar";

// Read all rows; returns objects with rowNumber (1-based, as in the sheet)
export async function readRows() {
  const api = await sheetsApi();
  const res = await api.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${tab()}!A1:H`,
  });
  const [headers, ...rows] = res.data.values || [];
  if (!headers) throw new Error("Sheet is empty - add a header row first");
  return rows.map((r, i) => {
    const obj = { rowNumber: i + 2 }; // +2: skip header, 1-based
    headers.forEach((h, c) => (obj[h] = r[c] || ""));
    return obj;
  });
}

// Update Status / Buffer Post ID / Notes for one row. NEVER touches
// Date/Time/Platform/Caption/Media URL and never deletes rows (rules 8-9).
export async function updateRow(rowNumber, { status, postId, notes }) {
  const api = await sheetsApi();
  const writes = [];
  if (status !== undefined) writes.push({ range: `${tab()}!F${rowNumber}`, values: [[status]] });
  if (postId !== undefined) writes.push({ range: `${tab()}!G${rowNumber}`, values: [[postId]] });
  if (notes !== undefined) writes.push({ range: `${tab()}!H${rowNumber}`, values: [[notes]] });
  if (!writes.length) return;
  await api.spreadsheets.values.batchUpdate({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    requestBody: { valueInputOption: "RAW", data: writes },
  });
}
