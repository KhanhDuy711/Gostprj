import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Matches the files produced by scripts/generate-demo-assets.sh
const clips = [
  { id: "neon-pulse", title: "Neon Pulse", duration: 6 },
  { id: "cyber-grid", title: "Cyber Grid", duration: 6 },
  { id: "liquid-chrome", title: "Liquid Chrome", duration: 6 },
  { id: "particle-flux", title: "Particle Flux", duration: 6 },
  { id: "glitch-matrix", title: "Glitch Matrix", duration: 6 },
  { id: "aurora-drift", title: "Aurora Drift", duration: 6 },
  { id: "pulse-wave", title: "Pulse Wave", duration: 6 },
  { id: "deep-field", title: "Deep Field", duration: 5 },
];

function videoKeys(id: string) {
  return {
    thumbnailKey: `thumbnails/${id}.jpg`,
    previewVideoKey: `previews/${id}.mp4`,
    originalVideoKey: `originals/${id}.mp4`,
  };
}

async function main() {
  console.log("Seeding categories...");
  const [cyber, fluid, nature, retro] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "cyber-neon" },
      update: {},
      create: { name: "Cyber & Neon", slug: "cyber-neon", description: "Futuristic grids, glitch and neon motion loops." },
    }),
    prisma.category.upsert({
      where: { slug: "fluid-abstract" },
      update: {},
      create: { name: "Fluid & Abstract", slug: "fluid-abstract", description: "Liquid, plasma and particle backgrounds." },
    }),
    prisma.category.upsert({
      where: { slug: "nature-light" },
      update: {},
      create: { name: "Nature & Light", slug: "nature-light", description: "Auroras, gradients and soft ambient loops." },
    }),
    prisma.category.upsert({
      where: { slug: "retro-wave" },
      update: {},
      create: { name: "Retro Wave", slug: "retro-wave", description: "80s-inspired pulse and test-pattern aesthetics." },
    }),
  ]);

  console.log("Seeding packs...");

  const packSpecs = [
    {
      name: "Neon Pulse Waves",
      slug: "neon-pulse-waves",
      description:
        "A high-energy set of neon color-cycling loops built for club visuals, livestream overlays, and VJ sets. Seamless loops, no audio, ready to drop straight into your show.",
      priceCents: 1900,
      categoryId: cyber.id,
      isFeatured: true,
      isNew: false,
      clipIds: ["neon-pulse", "cyber-grid", "glitch-matrix", "pulse-wave"],
    },
    {
      name: "Liquid Nebula Pack",
      slug: "liquid-nebula-pack",
      description:
        "Organic fluid gradients and particle fields for a softer, cinematic ambience. Great for intros, lower thirds backgrounds, and chill-stream overlays.",
      priceCents: 2400,
      categoryId: fluid.id,
      isFeatured: true,
      isNew: true,
      clipIds: ["liquid-chrome", "particle-flux", "aurora-drift", "deep-field"],
    },
  ];

  for (const spec of packSpecs) {
    const pack = await prisma.productPack.upsert({
      where: { slug: spec.slug },
      update: {},
      create: {
        name: spec.name,
        slug: spec.slug,
        description: spec.description,
        priceCents: spec.priceCents,
        coverImageKey: `covers/${spec.clipIds[0]}.jpg`,
        totalFileSizeMb: 24,
        isFeatured: spec.isFeatured,
        isNew: spec.isNew,
        isPublished: true,
        categoryId: spec.categoryId,
      },
    });

    await prisma.productVideo.deleteMany({ where: { packId: pack.id } });

    let order = 0;
    for (const clipId of spec.clipIds) {
      const clip = clips.find((c) => c.id === clipId)!;
      const keys = videoKeys(clip.id);
      await prisma.productVideo.create({
        data: {
          packId: pack.id,
          title: clip.title,
          order: order++,
          durationSeconds: clip.duration,
          fileSizeMb: 6,
          ...keys,
        },
      });
    }
  }

  // Placeholder for Retro Wave category (no pack yet) so the filter UI isn't empty-ironic
  void retro;

  console.log("Seeding admin + demo customer...");
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@visualbar.store" },
    update: {},
    create: {
      email: "admin@visualbar.store",
      name: "Store Admin",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@visualbar.store" },
    update: {},
    create: {
      email: "customer@visualbar.store",
      name: "Demo Customer",
      role: "CUSTOMER",
      passwordHash: customerPasswordHash,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
