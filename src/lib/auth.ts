import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE_NAME = "session";
const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000;

function sign(payload: string): string {
  const secret = process.env.AUTH_PASSWORD ?? "";
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + SESSION_MAX_AGE_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (Number(expiresAt) <= Date.now()) return false;

  return safeEqual(signature, sign(expiresAt));
}

export function verifyCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.AUTH_USERNAME ?? "";
  const expectedPassword = process.env.AUTH_PASSWORD ?? "";
  if (!expectedUsername || !expectedPassword) return false;

  return safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}
