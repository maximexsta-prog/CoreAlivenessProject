/* ===========================================================================
 *  admin-store.js — the storage adapter used by admin.html.
 *
 *  THE IDEA
 *  --------
 *  The dashboard needs to log in and read/write its private notes. WHERE that
 *  happens depends on where the page runs:
 *    • on your laptop (localhost) or a ?mock=1 preview → there is no server, so
 *      we fake it with the browser's localStorage (passphrase is "demo").
 *    • on the live Netlify site → the real /api/admin function (see admin.mjs).
 *
 *  Both expose the SAME async methods, so admin.html calls CA.store.<method>()
 *  and never cares which one is behind it. The passphrase you type IS the key —
 *  it's sent as the `x-admin-key` header on every call and never stored on any
 *  server here.
 * ========================================================================= */
window.CA = (function () {
  // Look for ?mock=1 in the URL.
  const params = new URLSearchParams(location.search);
  // Are we running locally? (localhost, 127.x, a LAN IP, or no hostname at all).
  const IS_LOCAL = /^(localhost$|127\.|0\.0\.0\.0|192\.168\.|10\.)/.test(location.hostname) || !location.hostname;
  // Use the fake store when local OR when ?mock=1 is present.
  const USE_MOCK = IS_LOCAL || params.has('mock');

  /* ---- live store: talks to the /api/admin Netlify function ---- */
  // Shared helper: POST { action, … } with the passphrase header. A 401 comes
  // back as { auth:false } so the caller can show "wrong passphrase".
  async function post (key, payload) {
    let res;
    try {
      res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify(payload)
      });
    } catch (e) { return { error: 'network' }; }
    if (res.status === 401) return { auth: false };
    return res.json().catch(() => ({ error: 'parse' }));
  }
  const apiStore = {
    isMock: false,
    login   (key)        { return post(key, { action: 'login' }); },
    notesGet(key)        { return post(key, { action: 'notes-get' }); },
    notesSet(key, notes) { return post(key, { action: 'notes-set', notes }); }
  };

  /* ---- mock store: for localhost / ?mock=1 previews (passphrase "demo") ---- */
  const MOCK_PASS = 'demo';
  const NOTES_LS = 'ca-admin-notes';
  const gate = key => key === MOCK_PASS;
  const mockStore = {
    isMock: true,
    async login (key)        { return gate(key) ? { ok: true, notes: localStorage.getItem(NOTES_LS) || '', persisted: true } : { auth: false }; },
    async notesGet (key)     { return gate(key) ? { ok: true, notes: localStorage.getItem(NOTES_LS) || '', persisted: true } : { auth: false }; },
    async notesSet (key, notes) { if (!gate(key)) return { auth: false }; localStorage.setItem(NOTES_LS, String(notes || '')); return { ok: true, persisted: true }; }
  };

  return { store: USE_MOCK ? mockStore : apiStore, isMock: USE_MOCK };
})();
