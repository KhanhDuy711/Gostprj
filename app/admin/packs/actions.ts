"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";
import { packInputSchema } from "@/lib/validations/pack";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function togglePublish(packId: string, isPublished: boolean) {
  await requireAdmin();
  await prisma.productPack.update({ where: { id: packId }, data: { isPublished } });
  revalidatePath("/admin/packs");
  revalidatePath("/products");
}

export async function deletePack(packId: string) {
  await requireAdmin();
  await prisma.productPack.delete({ where: { id: packId } });
  revalidatePath("/admin/packs");
}

/**
 * Creates a pack with 3–10 uploaded videos. Each video upload goes through
 * lib/storage.ts, so swapping STORAGE_PROVIDER to "s3" later needs no
 * change here. Validates the 3–10 constraint via packInputSchema before
 * writing anything (spec 9).
 */
export async function createPack(formData: FormData) {
  await requireAdmin();

  const categoryId = String(formData.get("categoryId"));
  const name = String(formData.get("name"));
  const slug = String(formData.get("slug"));
  const description = String(formData.get("description"));
  const priceCents = Math.round(Number(formData.get("price")) * 100);
  const coverFile = formData.get("cover") as File;

  const videoCount = Number(formData.get("videoCount") ?? 0);
  const videos = [];
  for (let i = 0; i < videoCount; i++) {
    const title = String(formData.get(`video_${i}_title`) ?? `Video ${i + 1}`);
    const file = formData.get(`video_${i}_file`) as File | null;
    if (!file || file.size === 0) continue;

    const buf = Buffer.from(await file.arrayBuffer());
    const { key: originalKey } = await uploadFile("originals", buf, file.name);
    // In production, generate a real watermarked transcode + thumbnail here
    // (e.g. via an ffmpeg worker). For now the same bytes back the preview
    // key too — swap this block for a real transcoding pipeline.
    const { key: previewKey } = await uploadFile("previews", buf, file.name);

    videos.push({
      title,
      order: i,
      durationSeconds: 6,
      thumbnailKey: `covers/placeholder.jpg`,
      previewVideoKey: previewKey,
      originalVideoKey: originalKey,
      fileSizeMb: Math.round(file.size / (1024 * 1024)),
    });
  }

  const coverBuf = Buffer.from(await coverFile.arrayBuffer());
  const { key: coverKey } = await uploadFile("covers", coverBuf, coverFile.name);

  const parsed = packInputSchema.safeParse({
    name,
    slug,
    description,
    priceCents,
    coverImageKey: coverKey,
    categoryId,
    videos,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid pack data" };
  }

  const pack = await prisma.productPack.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      priceCents: parsed.data.priceCents,
      coverImageKey: parsed.data.coverImageKey,
      categoryId: parsed.data.categoryId,
      totalFileSizeMb: parsed.data.videos.reduce((sum, v) => sum + v.fileSizeMb, 0),
      isPublished: false,
      videos: { create: parsed.data.videos },
    },
  });

  revalidatePath("/admin/packs");
  return { ok: true, packId: pack.id };
}
