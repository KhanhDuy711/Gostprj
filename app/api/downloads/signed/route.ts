import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { verifyDownloadUrl } from "@/lib/signed-url";

const STORAGE_ROOT = path.join(process.cwd(), ".storage");

// Serves ORIGINAL (unwatermarked) assets and generated ZIPs. Reachable only
// with a valid HMAC-signed, time-limited URL minted by lib/signed-url.ts
// after the server has confirmed the requesting user owns a PAID order for
// the pack — never from an unauthenticated or unsigned request.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key") ?? "";
  const uid = searchParams.get("uid") ?? "";
  const exp = searchParams.get("exp") ?? "";
  const sig = searchParams.get("sig") ?? "";

  const result = verifyDownloadUrl({ key, userId: uid, exp, sig });
  if (!result.valid) {
    return NextResponse.json({ error: `Invalid or expired download link (${result.reason})` }, { status: 403 });
  }

  const fullPath = path.normalize(path.join(STORAGE_ROOT, key));
  if (!fullPath.startsWith(STORAGE_ROOT)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const stats = await stat(fullPath);
    if (!stats.isFile()) throw new Error("not a file");
    const buf = await readFile(fullPath);
    const filename = path.basename(fullPath);
    return new NextResponse(buf, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
