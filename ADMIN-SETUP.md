# Admin dashboard — `corealivenessproject.com/admin`

A private, password-protected control center that gathers your existing dashboards
(content calendar, Mt. Saint-Anne logis, DWS launch cockpit, tides, TSLA) behind
**one real login**, plus a server-stored private notes/quick-links pad.

It works exactly like `logispourtravailleurs.ca/admin`: the page is a static file,
but the real protection is a **Netlify Function** that refuses to answer unless the
request carries the correct passphrase. The passphrase lives only in the Netlify
`ADMIN_KEY` environment variable — never in the code, never in the browser.

## Files

| File | Role |
|---|---|
| `admin.html` | The login gate + dashboard hub (served at `/admin`). |
| `admin-store.js` | Client bridge: live (`/api/admin`) vs. local mock (`?mock=1`). |
| `netlify/functions/admin.mjs` | The server: checks the passphrase, stores notes in Netlify Blobs. |
| `netlify.toml` | Registers the functions directory. |
| `_headers` | `noindex` / `no-store` / anti-framing headers for `/admin` + `/api/*`. |
| `robots.txt` | `Disallow: /admin` and `/api/`. |

## One-time setup (Netlify)

1. **Confirm the site is on Netlify.** This dashboard's login needs Netlify
   Functions. If the site is hosted elsewhere, see *Other hosts* below.
2. **Set the password.** Netlify → **Site configuration → Environment variables →
   Add a variable**: name `ADMIN_KEY`, value = a long, unique passphrase. Do **not**
   commit it anywhere.
3. **(Optional) Enable Netlify Blobs** so the private notes persist across devices.
   Blobs is on by default for most sites; if notes don't save, enable it in the
   Netlify UI. Without it, everything still works — notes just aren't persisted.
4. **Deploy** (push to the branch Netlify builds). Open `https://corealivenessproject.com/admin`.

## How the login works

1. You type the passphrase in the gate.
2. The browser POSTs `{action:"login"}` to `/api/admin` with an `x-admin-key` header.
3. The function compares that header to `ADMIN_KEY`. Wrong/missing → **401**, nothing
   is returned. Correct → it returns your saved notes.
4. The passphrase is kept only in this browser tab (`sessionStorage`) and is
   auto-forgotten after **15 minutes of inactivity** or when you click **🔒 Verrouiller**.

## Change or rotate the password

Update the `ADMIN_KEY` variable in Netlify and redeploy (or trigger a redeploy).
Everyone is signed out on the next call; sign in again with the new passphrase.

## Local preview (no server)

Open `admin.html?mock=1` (or on `localhost`). It runs in **mock mode**: the passphrase
is `demo` and notes are kept in the browser's `localStorage`. This is only for
previewing the UI — it is **not** a real login and never reaches a server.

## Security notes

- The password is verified **server-side**; a wrong guess gets `401` and no data.
- The page and API send `noindex` + `no-store`; `robots.txt` disallows `/admin`.
- No secret value is ever written to the page, the JS, or an error message.
- The 5 linked dashboards are **link-only** for now — they still rely on their
  secret URLs. To put them behind this same password too, that's a follow-up pass
  (add the gate to each page and route its data through an authenticated function).

## Other hosts (if the site is NOT on Netlify)

- **Cloudflare Pages:** keep `admin.html` / `admin-store.js` as-is; replace
  `netlify/functions/admin.mjs` with a Pages Function at `functions/api/admin.js`
  doing the same `x-admin-key` vs. env-var check (use Workers KV instead of Blobs
  for notes). `_redirects` / `_headers` already work on Pages.
- **GitHub Pages / static only:** there is no server, so a real password check
  isn't possible on-page. Either move `/admin` to Netlify/Cloudflare, or front it
  with an external gate (e.g. Cloudflare Access) — a client-side-only password can
  be read from source and should not be relied on.
