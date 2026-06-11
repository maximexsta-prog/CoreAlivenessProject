/**
 * Core Aliveness - Buffer Scheduler (Google Apps Script)
 * Lives inside the Content Calendar sheet. Safety rules:
 * - Only rows with Status = "Ready" are touched.
 * - Success: Status = "Scheduled" + Buffer Post ID. Failure: Status = "Error" + reason in Notes.
 * - Never deletes rows, never edits captions.
 * - "Preview" is a dry run; "Schedule" asks for confirmation first.
 *
 * Expected columns (row 1 = headers):
 * A Date | B Time | C Platform | D Caption | E Media URL | F Status | G Buffer Post ID | H Notes
 */

var BUFFER_ENDPOINT = "https://api.buffer.com";

// ---------- Remote control (web app) ----------
// Deploy as web app (Execute as: Me, Access: Anyone) to allow trusted remote
// calls. Every call must include the secret key stored in Script Properties
// under API_KEY - requests without it are rejected.
function doGet(e) {
  var out;
  try {
    var key = PropertiesService.getScriptProperties().getProperty("API_KEY");
    if (!key || !e.parameter.key || e.parameter.key !== key) throw new Error("Unauthorized");

    var action = e.parameter.action || "rows";
    if (action === "rows") {
      out = getRows().rows;
    } else if (action === "channels") {
      out = getChannels();
    } else if (action === "setStatus") {
      // setStatus&row=2&status=Ready - only touches Status/Notes columns
      var rowNum = Number(e.parameter.row);
      if (!rowNum || rowNum < 2) throw new Error("Invalid row");
      updateRow(getRows().sheet, rowNum, e.parameter.status, undefined, e.parameter.notes || "");
      out = { ok: true, row: rowNum, status: e.parameter.status };
    } else if (action === "preview") {
      out = getRows().rows.filter(isReady);
    } else if (action === "format") {
      formatSheet();
      out = { ok: true };
    } else if (action === "schedule") {
      out = scheduleReadyCore(); // live scheduling, same code path as the menu
    } else {
      throw new Error("Unknown action");
    }
  } catch (err) {
    out = { error: err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

// POST endpoint: add new rows (append only - never overwrites existing data).
// Body: { key, action: "addRows", rows: [{Date, Time, Platform, Caption, ...}] }
function doPost(e) {
  var out;
  try {
    var body = JSON.parse(e.postData.contents || "{}");
    var key = PropertiesService.getScriptProperties().getProperty("API_KEY");
    if (!key || body.key !== key) throw new Error("Unauthorized");
    if (body.action !== "addRows") throw new Error("Unknown action");

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var added = 0;
    body.rows.forEach(function (row) {
      var values = headers.map(function (h) { return row[h] !== undefined ? row[h] : ""; });
      sheet.appendRow(values);
      added++;
    });
    out = { ok: true, added: added };
  } catch (err) {
    out = { error: err.message };
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function setApiKey() {
  var ui = SpreadsheetApp.getUi();
  var res = ui.prompt("Remote API key", "Choose a long random secret:", ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  PropertiesService.getScriptProperties().setProperty("API_KEY", res.getResponseText().trim());
  ui.alert("API key saved.");
}

// ---------- Menu ----------
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Buffer Scheduler")
    .addItem("1. Set Buffer token", "setToken")
    .addItem("2. Test Buffer connection", "testBuffer")
    .addItem("3. Preview Ready posts (dry run)", "previewReady")
    .addItem("4. Schedule Ready posts (LIVE)", "scheduleReady")
    .addItem("5. Set remote API key", "setApiKey")
    .addItem("6. Format sheet", "formatSheet")
    .addToUi();
}

// Token is stored in Script Properties - never visible in the sheet itself.
function setToken() {
  var ui = SpreadsheetApp.getUi();
  var res = ui.prompt("Buffer token", "Paste your Buffer API personal key:", ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  PropertiesService.getScriptProperties().setProperty("BUFFER_TOKEN", res.getResponseText().trim());
  ui.alert("Token saved.");
}

// ---------- Buffer API (GraphQL) ----------
function bufferGql(query, variables) {
  var token = PropertiesService.getScriptProperties().getProperty("BUFFER_TOKEN");
  if (!token) throw new Error('No Buffer token - run "Set Buffer token" first.');
  var res = UrlFetchApp.fetch(BUFFER_ENDPOINT, {
    method: "post",
    contentType: "application/json",
    headers: { Authorization: "Bearer " + token },
    payload: JSON.stringify({ query: query, variables: variables || {} }),
    muteHttpExceptions: true,
  });
  var data = JSON.parse(res.getContentText() || "{}");
  if (res.getResponseCode() !== 200 || data.errors) {
    throw new Error("Buffer API: " + ((data.errors && data.errors[0].message) || res.getResponseCode()));
  }
  return data.data;
}

function getChannels() {
  var account = bufferGql("{ account { email organizations { id name } } }").account;
  var channels = [];
  account.organizations.forEach(function (org) {
    var d = bufferGql(
      "query($orgId: OrganizationId!){ channels(input:{organizationId:$orgId}){ id name service } }",
      { orgId: org.id }
    );
    channels = channels.concat(d.channels);
  });
  return { email: account.email, channels: channels };
}

function testBuffer() {
  var info = getChannels();
  var lines = info.channels.map(function (c) {
    return "- " + c.service + " | " + c.name + " | " + c.id;
  });
  SpreadsheetApp.getUi().alert("Connected as " + info.email + "\n\nChannels:\n" + lines.join("\n"));
}

// ---------- Sheet helpers ----------
function getRows() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = { rowNumber: i + 1 };
    headers.forEach(function (h, c) { row[h] = values[i][c]; });
    rows.push(row);
  }
  return { sheet: sheet, rows: rows };
}

function isReady(r) {
  return String(r.Status || "").trim().toLowerCase() === "ready";
}

// Combine the Date and Time cells (Date objects or text) into one Date.
function toDateTime(dateVal, timeVal) {
  var d = dateVal instanceof Date ? dateVal : new Date(dateVal);
  var h = 0, m = 0;
  if (timeVal instanceof Date) { h = timeVal.getHours(); m = timeVal.getMinutes(); }
  else {
    var parts = String(timeVal).trim().split(":");
    h = Number(parts[0]); m = Number(parts[1] || 0);
  }
  if (isNaN(d.getTime()) || isNaN(h)) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
}

// Find a column number by its header name (1-based). Header-driven so
// rearranging or inserting columns can never corrupt the wrong cells.
function colOf(sheet, headerName) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idx = headers.indexOf(headerName);
  if (idx === -1) throw new Error('Missing column "' + headerName + '" in row 1');
  return idx + 1;
}

// Only ever writes Status, Buffer Post ID, Notes - located by header name.
function updateRow(sheet, rowNumber, status, postId, notes) {
  if (status !== undefined) sheet.getRange(rowNumber, colOf(sheet, "Status")).setValue(status);
  if (postId !== undefined) sheet.getRange(rowNumber, colOf(sheet, "Buffer Post ID")).setValue(postId);
  if (notes !== undefined) sheet.getRange(rowNumber, colOf(sheet, "Notes")).setValue(notes);
}

// ---------- Media Library ----------
// Tab "Media Library": Asset ID | Drive URL (+ optional Name column).
// Returns a map of assetId -> driveUrl.
function getMediaLibrary() {
  var tab = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Media Library");
  if (!tab) return {};
  var values = tab.getDataRange().getValues();
  var headers = values[0];
  var idCol = headers.indexOf("Asset ID");
  var urlCol = headers.indexOf("Drive URL");
  if (idCol === -1 || urlCol === -1) return {};
  var map = {};
  for (var i = 1; i < values.length; i++) {
    var id = String(values[i][idCol] || "").trim();
    if (id) map[id] = String(values[i][urlCol] || "").trim();
  }
  return map;
}

// Convert a Google Drive share link into a direct-download URL that Buffer
// can fetch. Passes non-Drive URLs through unchanged.
function toDirectMediaUrl(url) {
  var m = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?[^ ]*id=)([\w-]+)/);
  if (m) return "https://drive.google.com/uc?export=download&id=" + m[1];
  return url;
}

// Resolve the media for a row. Asset ID takes priority over Media URL.
// Returns "" when the row has no media; throws if an Asset ID can't be found.
function resolveMedia(row, library) {
  var assetId = String(row["Asset ID"] || "").trim();
  if (assetId) {
    var driveUrl = library[assetId];
    if (!driveUrl) throw new Error('Asset ID "' + assetId + '" not found in Media Library');
    return toDirectMediaUrl(driveUrl);
  }
  var mediaUrl = String(row["Media URL"] || "").trim();
  return mediaUrl ? toDirectMediaUrl(mediaUrl) : "";
}

// ---------- Visual formatting (safe: never touches cell values) ----------
function formatSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var maxRows = Math.max(sheet.getMaxRows(), 100);

  // Ensure the Asset ID column exists (header-driven code finds it anywhere)
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 8)).getValues()[0];
  if (headers.indexOf("Asset ID") === -1) {
    var nextCol = sheet.getLastColumn() + 1;
    sheet.getRange(1, nextCol).setValue("Asset ID");
    sheet.getRange(1, nextCol, 1, 1)
      .setBackground("#2d5a3d").setFontColor("#ffffff").setFontWeight("bold")
      .setFontSize(11).setVerticalAlignment("middle").setHorizontalAlignment("center");
    sheet.setColumnWidth(nextCol, 110);
    sheet.getRange(2, nextCol, maxRows - 1, 1).setHorizontalAlignment("center");
  }

  // Ensure the Media Library tab exists
  var lib = ss.getSheetByName("Media Library");
  if (!lib) {
    lib = ss.insertSheet("Media Library");
    lib.getRange("A1:C1").setValues([["Asset ID", "Name", "Drive URL"]]);
  }
  lib.getRange("A1:C1")
    .setBackground("#2d5a3d").setFontColor("#ffffff").setFontWeight("bold")
    .setFontSize(11).setVerticalAlignment("middle").setHorizontalAlignment("center");
  lib.setFrozenRows(1);
  lib.setColumnWidth(1, 110); lib.setColumnWidth(2, 220); lib.setColumnWidth(3, 420);

  // Header: forest green, white bold text, frozen
  sheet.getRange("A1:H1")
    .setBackground("#2d5a3d").setFontColor("#ffffff")
    .setFontWeight("bold").setFontSize(11)
    .setVerticalAlignment("middle").setHorizontalAlignment("center");
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);

  // Column widths tuned for content
  var widths = { 1: 100, 2: 70, 3: 100, 4: 420, 5: 220, 6: 110, 7: 180, 8: 260 };
  for (var col in widths) sheet.setColumnWidth(Number(col), widths[col]);

  var body = sheet.getRange(2, 1, maxRows - 1, 8);
  body.setVerticalAlignment("middle").setFontSize(10);
  sheet.getRange(2, 4, maxRows - 1, 1).setWrap(true); // Caption wraps
  sheet.getRange(2, 8, maxRows - 1, 1).setWrap(true); // Notes wrap

  // Number formats
  sheet.getRange(2, 1, maxRows - 1, 1).setNumberFormat("yyyy-mm-dd");
  sheet.getRange(2, 2, maxRows - 1, 1).setNumberFormat("HH:mm");

  // Status dropdown: Draft / Ready / Scheduled / Error
  var statusRange = sheet.getRange(2, 6, maxRows - 1, 1);
  statusRange.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["Draft", "Ready", "Scheduled", "Error"], true)
      .setAllowInvalid(true).build()
  );
  statusRange.setHorizontalAlignment("center");

  // Color-code Status + tint the whole row when scheduled or errored
  var rules = [];
  function statusRule(value, bg, fg) {
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(value).setBackground(bg).setFontColor(fg)
      .setRanges([statusRange]).build();
  }
  rules.push(statusRule("Ready", "#fff3cd", "#7a5d00"));      // amber
  rules.push(statusRule("Scheduled", "#d3f2dc", "#1e6b3a"));  // green
  rules.push(statusRule("Error", "#fadbd8", "#922b21"));      // red
  rules.push(statusRule("Draft", "#e8e8e8", "#555555"));      // grey
  sheet.setConditionalFormatRules(rules);

  // Platform dropdown
  sheet.getRange(2, 3, maxRows - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(["facebook", "instagram"], true)
      .setAllowInvalid(true).build()
  ).setHorizontalAlignment("center");

  // Subtle banding on the data area (skip if already banded)
  var dataRange = sheet.getRange(2, 1, maxRows - 1, 8);
  if (!sheet.getBandings().length) {
    dataRange.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  }
}

// ---------- Phase 4: preview (dry run, writes nothing) ----------
function previewReady() {
  var data = getRows();
  var ready = data.rows.filter(isReady);
  if (!ready.length) { SpreadsheetApp.getUi().alert("No rows marked Ready."); return; }
  var lines = ready.map(function (r) {
    var when = toDateTime(r.Date, r.Time);
    return "Row " + r.rowNumber + ": " + (when ? when.toLocaleString() : "INVALID DATE/TIME") +
      " | " + r.Platform + " | " + String(r.Caption).slice(0, 50);
  });
  SpreadsheetApp.getUi().alert(ready.length + " Ready post(s):\n\n" + lines.join("\n") + "\n\nNothing was posted (dry run).");
}

// ---------- Phases 5-6: schedule + write back ----------
// Menu version: asks for confirmation, then runs the core.
function scheduleReady() {
  var ui = SpreadsheetApp.getUi();
  var ready = getRows().rows.filter(isReady);
  if (!ready.length) { ui.alert("No rows marked Ready."); return; }
  var confirm = ui.alert("Schedule " + ready.length + " post(s) to Buffer?", ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;
  var r = scheduleReadyCore();
  ui.alert("Done. Scheduled: " + r.scheduled + ", Errors: " + r.errors + " (see Notes column).");
}

// Core scheduling loop - no UI, callable from the menu or the web app.
function scheduleReadyCore() {
  var data = getRows();
  var ready = data.rows.filter(isReady);
  var channels = getChannels().channels;
  var library = getMediaLibrary();
  var ok = 0, failed = 0;

  ready.forEach(function (r) {
    try {
      var platform = String(r.Platform || "").trim().toLowerCase();
      var channel = channels.filter(function (c) { return c.service.toLowerCase() === platform; })[0];
      if (!channel) throw new Error('No Buffer channel for platform "' + r.Platform + '"');

      var when = toDateTime(r.Date, r.Time);
      if (!when) throw new Error("Invalid Date/Time");
      if (when < new Date()) throw new Error("Scheduled time is in the past");
      if (!String(r.Caption || "").trim()) throw new Error("Caption is empty");

      // Asset ID > Media URL; Instagram requires media.
      var mediaUrl = resolveMedia(r, library);
      if (platform === "instagram" && !mediaUrl) {
        throw new Error("Instagram posts require media (Asset ID or Media URL)");
      }

      var input = {
        channelId: channel.id,
        text: String(r.Caption),
        schedulingType: "automatic",
        mode: "customScheduled",
        dueAt: when.toISOString(),
      };
      // Channel-specific type: a normal feed post (not story/reel)
      if (platform === "facebook") input.metadata = { facebook: { type: "post" } };
      if (platform === "instagram") input.metadata = { instagram: { type: "post" } };
      if (mediaUrl) input.assets = [{ image: { url: mediaUrl } }];

      var d = bufferGql(
        "mutation($input: CreatePostInput!){ createPost(input:$input){" +
        " ... on PostActionSuccess { post { id } } ... on MutationError { message } } }",
        { input: input }
      );
      if (!d.createPost.post) throw new Error(d.createPost.message || "Unknown Buffer error");

      updateRow(data.sheet, r.rowNumber, "Scheduled", d.createPost.post.id, "");
      ok++;
    } catch (err) {
      updateRow(data.sheet, r.rowNumber, "Error", undefined, err.message);
      failed++;
    }
  });

  return { scheduled: ok, errors: failed };
}
