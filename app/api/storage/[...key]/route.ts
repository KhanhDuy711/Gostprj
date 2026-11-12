import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// Serves PUBLIC assets only (covers, thumbnails, watermarked previews) from
// the local mock storage provider. Original video files are never routed
// through here — see app/api/downloads/signed/route.ts for those, which
// requires a valid, time-limited, HMAC-signed URL tied to a paid order.
const STORAGE_ROOT = path.join(process.cwd(), ".storage");
const PUBLIC_PREFIXES = ["covers", "thumbnails", "previews"];

const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  const prefix = keyParts[0];
  if (!PUBLIC_PREFIXES.includes(prefix)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Prevent path traversal outside the storage root.
  const fullPath = path.normalize(path.join(STORAGE_ROOT, key));
  if (!fullPath.startsWith(STORAGE_ROOT)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const stats = await stat(fullPath);
    if (!stats.isFile()) throw new Error("not a file");
    const buf = await readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    return new NextResponse(buf, {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
