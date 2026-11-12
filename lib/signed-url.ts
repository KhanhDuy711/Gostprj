/**
 * Minimal signed-URL helper for protected downloads (originals + ZIP packs).
 *
 * This is deliberately framework-free (HMAC-SHA256 over key+expiry) so it
 * works the same whether the underlying storage is local disk (mock
 * provider) or S3/R2 later — swap only lib/storage.ts, not this file.
 *
 * Never grant download access based on a frontend "payment succeeded"
 * message: callers must check the Order/Payment status in the database
 * before calling `signDownloadUrl`.
 */

import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.DOWNLOAD_URL_SECRET ?? "dev-only-insecure-secret";
const DEFAULT_TTL = Number(process.env.DOWNLOAD_URL_TTL_SECONDS ?? 300);

function sign(payload: string): string {
  return createHmac("sha256", SECRET).update(payload).digest("hex");
}

export function signDownloadUrl(params: {
  key: string;
  userId: string;
  ttlSeconds?: number;
}): string {
  const exp = Math.floor(Date.now() / 1000) + (params.ttlSeconds ?? DEFAULT_TTL);
  const payload = `${params.key}:${params.userId}:${exp}`;
  const sig = sign(payload);
  const qs = new URLSearchParams({
    key: params.key,
    uid: params.userId,
    exp: String(exp),
    sig,
  });
  return `/api/downloads/signed?${qs.toString()}`;
}

export function verifyDownloadUrl(params: {
  key: string;
  userId: string;
  exp: string;
  sig: string;
}): { valid: boolean; reason?: string } {
  const exp = Number(params.exp);
  if (!Number.isFinite(exp)) return { valid: false, reason: "bad_expiry" };
  if (Math.floor(Date.now() / 1000) > exp) return { valid: false, reason: "expired" };

  const payload = `${params.key}:${params.userId}:${exp}`;
  const expected = sign(payload);
  const a = Buffer.from(expected);
  const b = Buffer.from(params.sig);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { valid: false, reason: "bad_signature" };
  }
  return { valid: true };
}
