// Entry point. Commands:
//   node src/index.js test-buffer        Phase 3: show account + profiles (read-only)
//   node src/index.js test-sheet         Phase 4: print rows marked Ready (read-only)
//   node src/index.js schedule           Phase 5: DRY RUN (prints, posts nothing)
//   node src/index.js schedule --live    Phase 5+6: actually schedules + updates sheet
import "dotenv/config"; // Phase 2: loads .env
import { getAccount, getProfiles } from "./bufferClient.js";
import { readRows } from "./sheetsClient.js";
import { run } from "./scheduler.js";

const cmd = process.argv[2];

if (cmd === "test-buffer") {
  const account = await getAccount();
  console.log("Account:", account.id, account.email || "");
  const profiles = await getProfiles();
  for (const p of profiles) {
    console.log(`- ${p.service} | ${p.name} | channel ID: ${p.id}`);
  }
} else if (cmd === "test-sheet") {
  const rows = await readRows();
  const ready = rows.filter((r) => r.Status?.trim().toLowerCase() === "ready");
  console.log(`${rows.length} rows total, ${ready.length} Ready:`);
  for (const r of ready) {
    console.log(`Row ${r.rowNumber}: ${r.Date} ${r.Time} | ${r.Platform} | ${r.Caption?.slice(0, 60)}`);
  }
} else if (cmd === "schedule") {
  await run({ dryRun: !process.argv.includes("--live") });
} else {
  console.log("Usage: node src/index.js <test-buffer | test-sheet | schedule [--live]>");
}
