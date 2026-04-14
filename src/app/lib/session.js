import redis from "./redis";

const SESSION_TTL = 600; // 10 minutes (seconds)

export async function saveSession(session) {
  const key = `vend:session:${session.sessionId}`;
  await redis.set(key, JSON.stringify(session), "EX", SESSION_TTL);
}
export async function getSession(sessionId) {
  const data = await redis.get(`vend:session:${sessionId}`);
  return data ? JSON.parse(data) : null;
}
export async function updateSession(sessionId, updates) {
  const key = `vend:session:${sessionId}`;
  const existing = await getSession(sessionId);

  if (!existing) return null;

  const updated = { ...existing, ...updates };
  await redis.set(key, JSON.stringify(updated), "EX", SESSION_TTL);

  return updated;
}
