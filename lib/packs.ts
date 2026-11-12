import { prisma } from "@/lib/prisma";
import { demoPacks, demoCategories } from "@/lib/demo-data";
import type { PackWithVideos } from "@/types";

const USE_DEMO_DATA = !process.env.DATABASE_URL;

const packSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  priceCents: true,
  currency: true,
  coverImageKey: true,
  resolution: true,
  format: true,
  totalFileSizeMb: true,
  license: true,
  isFeatured: true,
  isNew: true,
  category: { select: { id: true, name: true, slug: true } },
  videos: {
    orderBy: { order: "asc" as const },
    select: {
      id: true,
      title: true,
      order: true,
      durationSeconds: true,
      thumbnailKey: true,
      previewVideoKey: true,
    },
  },
} as const;

export async function getFeaturedPacks(): Promise<PackWithVideos[]> {
  if (USE_DEMO_DATA) return demoPacks.filter((p) => p.isFeatured);
  return prisma.productPack.findMany({
    where: { isPublished: true, isFeatured: true },
    select: packSelect,
    take: 6,
  });
}

export async function getAllPacks(params?: {
  categorySlug?: string;
  query?: string;
  sort?: "price_asc" | "price_desc" | "newest";
}): Promise<PackWithVideos[]> {
  if (USE_DEMO_DATA) {
    let packs = [...demoPacks];
    if (params?.categorySlug) {
      packs = packs.filter((p) => p.category.slug === params.categorySlug);
    }
    if (params?.query) {
      const q = params.query.toLowerCase();
      packs = packs.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (params?.sort === "price_asc") packs.sort((a, b) => a.priceCents - b.priceCents);
    if (params?.sort === "price_desc") packs.sort((a, b) => b.priceCents - a.priceCents);
    return packs;
  }

  return prisma.productPack.findMany({
    where: {
      isPublished: true,
      ...(params?.categorySlug ? { category: { slug: params.categorySlug } } : {}),
      ...(params?.query ? { name: { contains: params.query, mode: "insensitive" } } : {}),
    },
    select: packSelect,
    orderBy:
      params?.sort === "price_asc"
        ? { priceCents: "asc" }
        : params?.sort === "price_desc"
          ? { priceCents: "desc" }
          : { createdAt: "desc" },
  });
}

export async function getPackBySlug(slug: string): Promise<PackWithVideos | null> {
  if (USE_DEMO_DATA) return demoPacks.find((p) => p.slug === slug) ?? null;
  return prisma.productPack.findFirst({
    where: { slug, isPublished: true },
    select: packSelect,
  });
}

export async function getCategories() {
  if (USE_DEMO_DATA) return demoCategories;
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
