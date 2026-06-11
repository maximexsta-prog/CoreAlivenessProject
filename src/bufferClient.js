// Buffer API client (new GraphQL API) - https://developers.buffer.com
// Auth: personal key from Buffer Settings > API, sent as a Bearer token.
const ENDPOINT = "https://api.buffer.com";

async function gql(query, variables = {}) {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) throw new Error("BUFFER_ACCESS_TOKEN missing in .env");
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.errors) {
    throw new Error(`Buffer API error: ${data.errors?.[0]?.message || res.status}`);
  }
  return data.data;
}

// Phase 3: read-only checks, never posts anything
export async function getAccount() {
  const d = await gql(`{ account { id email organizations { id name } } }`);
  return d.account;
}

// "Profiles" are called channels in the new API; they live under an organization.
export async function getProfiles() {
  const account = await getAccount();
  const channels = [];
  for (const org of account.organizations) {
    const d = await gql(
      `query ($orgId: OrganizationId!) {
         channels(input: { organizationId: $orgId }) { id name service }
       }`,
      { orgId: org.id }
    );
    channels.push(...d.channels);
  }
  return channels;
}

// Phase 5: create ONE post at an exact time (customScheduled, never instant).
// scheduledAt = JS Date; mediaUrl optional, must be publicly accessible.
export async function createPost({ channelId, caption, scheduledAt, mediaUrl }) {
  const input = {
    channelId,
    text: caption,
    schedulingType: "automatic",
    mode: "customScheduled",
    dueAt: scheduledAt.toISOString(),
  };
  if (mediaUrl) input.assets = [{ image: { url: mediaUrl } }];

  const d = await gql(
    `mutation ($input: CreatePostInput!) {
       createPost(input: $input) {
         ... on PostActionSuccess { post { id dueAt } }
         ... on MutationError { message }
       }
     }`,
    { input }
  );
  const result = d.createPost;
  if (!result.post) throw new Error(`Buffer create failed: ${result.message || "unknown error"}`);
  return result.post.id; // Buffer Post ID, saved back to the sheet
}
