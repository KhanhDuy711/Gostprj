/**
 * Storage abstraction.
 *
 * `STORAGE_PROVIDER=mock` (default) stores files under ./.storage on local
 * disk and serves them from a local API route — good enough to exercise the
 * full upload -> preview -> purchase -> download flow without any cloud
 * credentials.
 *
 * `STORAGE_PROVIDER=s3` switches to Cloudflare R2 / AWS S3 (both speak the
 * S3 API). Fill in the S3_* env vars from .env.example and swap the
 * implementation of the two functions below for the real SDK calls — the
 * rest of the app only depends on this module's exported interface, so
 * nothing else needs to change.
 */

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const STORAGE_ROOT = path.join(process.cwd(), ".storage");

export type StorageKind = "covers" | "thumbnails" | "previews" | "originals";

export interface UploadResult {
  /** Opaque key stored in the database (never a public URL for originals). */
  key: string;
}

const provider = process.env.STORAGE_PROVIDER ?? "mock";

export async function uploadFile(
  kind: StorageKind,
  file: Buffer,
  originalName: string
): Promise<UploadResult> {
  if (provider === "s3") {
    throw new Error(
      "STORAGE_PROVIDER=s3 is not wired up yet — implement uploadFile() with your S3/R2 SDK client here."
    );
  }

  const ext = path.extname(originalName) || "";
  const key = `${kind}/${randomUUID()}${ext}`;
  const fullPath = path.join(STORAGE_ROOT, key);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, file);
  return { key };
}

/** Public URL for assets that are safe to expose directly (covers, thumbnails, watermarked previews). */
export function publicUrl(key: string): string {
  if (provider === "s3") {
    const cdn = process.env.S3_PUBLIC_CDN_URL ?? "";
    return `${cdn.replace(/\/$/, "")}/${key}`;
  }
  return `/api/storage/${key}`;
}
