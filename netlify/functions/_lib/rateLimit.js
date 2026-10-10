// Simple rate limiting using Netlify Blobs so counts survive across
// function calls (a plain JS variable would reset every invocation).
import { getStore } from "@netlify/blobs";

const store = () => getStore("chat-rate-limits");
const today = () => new Date().toISOString().slice(0, 10);
const minute = () => Math.floor(Date.now() / 60_000);

const PER_IP_PER_MINUTE = 4;
const PER_IP_PER_DAY = 40;
const GLOBAL_PER_DAY = 150;

async function bump(key, limit) {
  const count = (await store().get(key, { type: "json" })) || 0;
  if (count >= limit) return false;
  await store().setJSON(key, count + 1);
  return true;
}

// Returns true if the request is allowed. Checks a few small counters;
// under heavy concurrent traffic a handful of requests could slip past
// the exact limit (no atomic increment in Blobs), which is fine here.
export async function checkRateLimit(ip) {
  const day = today();
  const ok =
    (await bump(`global:${day}`, GLOBAL_PER_DAY)) &&
    (await bump(`ip:${ip}:min:${minute()}`, PER_IP_PER_MINUTE)) &&
    (await bump(`ip:${ip}:day:${day}`, PER_IP_PER_DAY));
  return ok;
}
