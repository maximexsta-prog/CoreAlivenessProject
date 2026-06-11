# Core Aliveness — Content Scheduler

Schedules posts from the **Content Calendar** Google Sheet to **Buffer**. Simple and safe: only rows with `Status = Ready` are touched, nothing is ever deleted, and live posting requires an explicit `--live` flag.

## Sheet layout (row 1 = headers)

| Date | Time | Platform | Caption | Media URL | Status | Buffer Post ID | Notes |
|------|------|----------|---------|-----------|--------|----------------|-------|
| 2026-06-15 | 09:00 | facebook | Caption text… | https://… (optional) | Ready | (auto) | (auto) |

- **Date** as `YYYY-MM-DD`, **Time** as `HH:MM` (24h, your local time).
- **Status**: you set `Ready`; the script sets `Scheduled` or `Error`.

## One-time setup

1. **Install Node.js** (v18+), then in this folder: `npm install`
2. **Secrets**: copy `.env.example` to `.env` and fill it in. `.env` is gitignored — never commit it.
3. **Buffer token**: Buffer → account settings → developer/apps → create an access token → paste into `BUFFER_ACCESS_TOKEN`.
4. **Google service account**:
   - In Google Cloud Console, create a project, enable the **Google Sheets API**.
   - Create a **service account**, download its JSON key, save it as `google-credentials.json` here (gitignored).
   - Open the JSON, copy the `client_email`, and **share the Content Calendar sheet with that email** (Editor).

## Commands (in order — move carefully)

| Command | What it does | Writes anything? |
|---|---|---|
| `npm run test:buffer` | Phase 3: shows Buffer account + profile IDs | No |
| `npm run test:sheet` | Phase 4: prints rows marked Ready | No |
| `npm run schedule` | Phase 5 dry run: shows what WOULD be scheduled | No |
| `node src/index.js schedule --live` | Phases 5–6: schedules to Buffer, updates sheet | **Yes** |

## Safety rules built in

- Only `Status = Ready` rows are processed.
- Success → `Status = Scheduled` + Buffer Post ID saved. Failure → `Status = Error` + reason in Notes.
- Rows are never deleted; captions are never modified.
- Default mode is dry run — `--live` is required to post.
