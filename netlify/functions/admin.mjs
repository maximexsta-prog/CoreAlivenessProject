/* ===========================================================================
 *  admin.mjs — the ADMIN API for corealivenessproject.com/admin.
 *
 *  WHAT IT IS
 *  ----------
 *  A tiny Netlify "Function" (server code, not browser code). The admin page
 *  (admin.html) is a static file anyone can download — so the REAL protection
 *  lives here: this function refuses to answer unless the request carries the
 *  correct passphrase. The passphrase itself is never written in the code; it
 *  lives only in the ADMIN_KEY environment variable set inside Netlify.
 *
 *  HOW YOU TALK TO IT
 *  ------------------
 *  One POST request to /api/admin. The browser sends a JSON body like
 *  { action: "login" } plus a secret header `x-admin-key`. The `action` decides
 *  what happens:
 *     action 'login'     → validate the key; on success also returns saved notes
 *     action 'notes-get' → return the private admin notes / quick-links blob
 *     action 'notes-set' → { notes } save the private admin notes blob
 *
 *  WHERE DATA LIVES
 *  ----------------
 *  The private notes are kept in "Netlify Blobs" (a small server-side key/value
 *  store) so they persist across devices AND stay behind the passphrase — they
 *  are never exposed to an un-authenticated visitor. If Blobs isn't enabled on
 *  the site yet, the login still works; notes just won't persist (degrade = ok).
 *
 *  SECURITY
 *  --------
 *  Wrong/missing passphrase → 401 and nothing else happens. No secret value is
 *  ever returned to the browser. Every reply is `cache-control: no-store` so
 *  private data is never cached by the browser or the CDN.
 * ========================================================================= */

// Tiny helper: build a JSON HTTP response that is never cached.
const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });

// Constant-time-ish string compare, so a wrong guess can't be timed character
// by character. Falls back to a plain !== when lengths differ.
function safeEqual (a, b) {
  a = String(a || ''); b = String(b || '');
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Open the "admin" Blobs bucket. Wrapped because getStore() can throw if Blobs
// isn't provisioned yet — callers treat a null store as "no persistence".
async function openStore () {
  try {
    const { getStore } = await import('@netlify/blobs');
    return getStore('ca-admin');
  } catch (e) {
    return null;
  }
}

// Read the saved notes blob (best effort; empty string when missing/unavailable).
async function readNotes () {
  const store = await openStore();
  if (!store) return { notes: '', persisted: false };
  try {
    const v = await store.get('notes', { type: 'json' });
    return { notes: (v && v.notes) || '', persisted: true };
  } catch (e) {
    return { notes: '', persisted: false };
  }
}

// The function itself. Netlify runs this for every request to /api/admin.
export default async (req) => {
  // Only POST is allowed (the action rides in the JSON body).
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  // If the owner forgot to set ADMIN_KEY in Netlify, fail loudly so it's obvious.
  if (!process.env.ADMIN_KEY) return json({ error: 'ADMIN_KEY not configured on the site' }, 500);

  // Read the secret header the dashboard sends with each call. Wrong/missing → 401.
  const key = req.headers.get('x-admin-key') || '';
  if (!safeEqual(key, process.env.ADMIN_KEY)) return json({ auth: false }, 401);

  // Parse the JSON body (fall back to {} if missing or malformed).
  const body = await req.json().catch(() => ({}));

  // --- action: login -------------------------------------------------------
  // The gate calls this with the typed passphrase. Reaching here means the key
  // was valid, so we return ok + the current notes in one round-trip.
  if (body.action === 'login') {
    const { notes, persisted } = await readNotes();
    return json({ ok: true, notes, persisted });
  }

  // --- action: notes-get ---------------------------------------------------
  if (body.action === 'notes-get') {
    const { notes, persisted } = await readNotes();
    return json({ ok: true, notes, persisted });
  }

  // --- action: notes-set ---------------------------------------------------
  // Save the private notes / quick-links text. Capped so a runaway paste can't
  // blow up the blob. Degrades to ok:true, persisted:false if Blobs is off.
  if (body.action === 'notes-set') {
    const store = await openStore();
    const notes = String(body.notes == null ? '' : body.notes).slice(0, 100000);
    if (!store) return json({ ok: true, persisted: false });
    try {
      await store.setJSON('notes', { notes, updated: new Date().toISOString() });
      return json({ ok: true, persisted: true });
    } catch (e) {
      return json({ ok: true, persisted: false });
    }
  }

  // Unknown action name → 400 Bad Request.
  return json({ error: 'unknown action' }, 400);
};

// Tell Netlify which URL path this function answers on.
export const config = { path: '/api/admin' };
