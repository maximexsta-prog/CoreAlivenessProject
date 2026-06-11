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

// Only ever writes Status (F), Buffer Post ID (G), Notes (H).
function updateRow(sheet, rowNumber, status, postId, notes) {
  if (status !== undefined) sheet.getRange(rowNumber, 6).setValue(status);
  if (postId !== undefined) sheet.getRange(rowNumber, 7).setValue(postId);
  if (notes !== undefined) sheet.getRange(rowNumber, 8).setValue(notes);
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
      var mediaUrl = String(r["Media URL"] || "").trim();
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
