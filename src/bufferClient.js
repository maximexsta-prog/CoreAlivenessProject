// Buffer API client - read account/profiles, create scheduled posts.
// Docs: https://buffer.com/developers/api
const BASE = "https://api.bufferapp.com/1";

const token = () => {
  const t = process.env.BUFFER_ACCESS_TOKEN;
  if (!t) throw new Error("BUFFER_ACCESS_TOKEN missing in .env");
  return t;
};

async function get(path) {
  const res = await fetch(`${BASE}${path}?access_token=${token()}`);
  if (!res.ok) throw new Error(`Buffer GET ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

// Phase 3: read-only checks, never posts anything
export const getAccount = () => get("/user.json");
export const getProfiles = () => get("/profiles.json");

// Phase 5: create ONE scheduled (not instant) post.
// scheduledAt = JS Date; mediaUrl optional.
export async function createPost({ profileId, caption, scheduledAt, mediaUrl }) {
  const body = new URLSearchParams();
  body.append("profile_ids[]", profileId);
  body.append("text", caption);
  body.append("scheduled_at", Math.floor(scheduledAt.getTime() / 1000));
  if (mediaUrl) body.append("media[photo]", mediaUrl);

  const res = await fetch(`${BASE}/updates/create.json?access_token=${token()}`, {
    method: "POST",
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(`Buffer create failed: ${data.message || res.status}`);
  }
  return data.updates[0].id; // Buffer Post ID, saved back to the sheet
}
