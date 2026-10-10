// Talks to the chat Netlify Function. Always resolves (never throws) with
// either { error } or the reply data, so the widget doesn't need try/catch.
export async function sendChatMessage(payload) {
  let res;
  try {
    // Calling the function directly rather than through the /api/chat
    // alias in netlify.toml - that redirect proved unreliable for POST
    // requests in production (served a stale cached 404 instead of
    // reaching the function), while this path has worked consistently.
    res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { error: "The assistant isn't reachable right now." };
  }

  // Surge has no function host, so it serves every path as the SPA's
  // index.html (200, text/html) instead of a real JSON error.
  if (!res.headers.get("content-type")?.includes("application/json")) {
    return { error: "The shopping assistant only works on the Netlify-hosted copy of this demo." };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: data.error || "The assistant is temporarily unavailable." };
  return data;
}
