import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import path from "path";
import { ZipArchive } from "archiver";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Streams a ZIP of every original video file in a pack, but only after
// confirming the requesting user has a PAID order containing that pack.
// Never trust a frontend flag — this re-checks the database every time.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ packId: string }> }) {
  const { packId } = await params;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as { id: string }).id;

  const owns = await prisma.orderItem.findFirst({
    where: { packId, order: { userId, status: "PAID" } },
  });
  if (!owns) {
    return NextResponse.json({ error: "You do not own this pack." }, { status: 403 });
  }

  const pack = await prisma.productPack.findUnique({ where: { id: packId }, include: { videos: true } });
  if (!pack) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.downloadLog.create({ data: { userId, packId, kind: "zip" } });

  // archiver streams the zip without buffering the whole thing in memory.
  const archive = new ZipArchive({ zlib: { level: 6 } });
  const storageRoot = path.join(process.cwd(), ".storage");

  for (const video of pack.videos) {
    archive.file(path.join(storageRoot, video.originalVideoKey), {
      name: `${video.order + 1}-${video.title}.mp4`,
    });
  }
  archive.finalize();

  const webStream = Readable.toWeb(archive) as ReadableStream;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${pack.slug}.zip"`,
    },
  });
}
