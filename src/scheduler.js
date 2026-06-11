// Scheduler - the only place that creates posts. Safety rules:
// - Only rows with Status = "Ready" are touched.
// - On success: Status = "Scheduled" + Buffer Post ID saved.
// - On failure: Status = "Error" + reason in Notes. Never deletes rows.
// - dryRun (default true) prints what WOULD happen without posting.
import { getProfiles, createPost } from "./bufferClient.js";
import { readRows, updateRow } from "./sheetsClient.js";

// Map a sheet Platform value ("facebook", "instagram") to a Buffer profile
function findProfile(profiles, platform) {
  return profiles.find((p) => p.service.toLowerCase() === platform.trim().toLowerCase());
}

export async function run({ dryRun = true } = {}) {
  const profiles = await getProfiles();
  const rows = await readRows();
  const ready = rows.filter((r) => r.Status?.trim().toLowerCase() === "ready");
  console.log(`${ready.length} row(s) marked Ready.`);

  for (const row of ready) {
    const label = `Row ${row.rowNumber} (${row.Platform} ${row.Date} ${row.Time})`;
    try {
      const profile = findProfile(profiles, row.Platform);
      if (!profile) throw new Error(`No Buffer profile for platform "${row.Platform}"`);

      const scheduledAt = new Date(`${row.Date}T${row.Time}`);
      if (isNaN(scheduledAt)) throw new Error(`Invalid Date/Time: "${row.Date}" "${row.Time}"`);
      if (scheduledAt < new Date()) throw new Error("Scheduled time is in the past");
      if (!row.Caption?.trim()) throw new Error("Caption is empty");

      if (dryRun) {
        console.log(`[DRY RUN] Would schedule ${label}: "${row.Caption.slice(0, 60)}..."`);
        continue;
      }

      const postId = await createPost({
        channelId: profile.id,
        service: profile.service.toLowerCase(),
        caption: row.Caption,
        scheduledAt,
        mediaUrl: row["Media URL"] || undefined,
      });
      await updateRow(row.rowNumber, { status: "Scheduled", postId });
      console.log(`OK ${label} -> Buffer ID ${postId}`);
    } catch (err) {
      console.error(`ERROR ${label}: ${err.message}`);
      if (!dryRun) await updateRow(row.rowNumber, { status: "Error", notes: err.message });
    }
  }
}
