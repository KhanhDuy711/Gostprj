/**
 * Static mirror of prisma/seed.ts, used only as a fallback when no
 * DATABASE_URL is configured (e.g. first run, or this sandbox, which can't
 * reach binaries.prisma.sh to install the Prisma engine). Once Postgres is
 * running and `npm run db:migrate && npm run db:seed` has been executed,
 * lib/packs.ts talks to the real database instead — this file is dead code
 * at that point.
 */
import type { PackWithVideos } from "@/types";

const categories = {
  cyber: { id: "cat_cyber", name: "Cyber & Neon", slug: "cyber-neon" },
  fluid: { id: "cat_fluid", name: "Fluid & Abstract", slug: "fluid-abstract" },
};

function clip(id: string, title: string, order: number, durationSeconds = 6) {
  return {
    id: `vid_${id}`,
    title,
    order,
    durationSeconds,
    thumbnailKey: `thumbnails/${id}.jpg`,
    previewVideoKey: `previews/${id}.mp4`,
  };
}

export const demoPacks: PackWithVideos[] = [
  {
    id: "pack_neon_pulse_waves",
    name: "Neon Pulse Waves",
    slug: "neon-pulse-waves",
    description:
      "A high-energy set of neon color-cycling loops built for club visuals, livestream overlays, and VJ sets. Seamless loops, no audio, ready to drop straight into your show.",
    priceCents: 1900,
    currency: "USD",
    coverImageKey: "covers/neon-pulse.jpg",
    resolution: "4K (3840x2160)",
    format: "MP4 (H.264)",
    totalFileSizeMb: 24,
    license: "Standard Commercial License",
    isFeatured: true,
    isNew: false,
    category: categories.cyber,
    videos: [
      clip("neon-pulse", "Neon Pulse", 0),
      clip("cyber-grid", "Cyber Grid", 1),
      clip("glitch-matrix", "Glitch Matrix", 2),
      clip("pulse-wave", "Pulse Wave", 3),
    ],
  },
  {
    id: "pack_liquid_nebula_pack",
    name: "Liquid Nebula Pack",
    slug: "liquid-nebula-pack",
    description:
      "Organic fluid gradients and particle fields for a softer, cinematic ambience. Great for intros, lower thirds backgrounds, and chill-stream overlays.",
    priceCents: 2400,
    currency: "USD",
    coverImageKey: "covers/liquid-chrome.jpg",
    resolution: "4K (3840x2160)",
    format: "MP4 (H.264)",
    totalFileSizeMb: 24,
    license: "Standard Commercial License",
    isFeatured: true,
    isNew: true,
    category: categories.fluid,
    videos: [
      clip("liquid-chrome", "Liquid Chrome", 0),
      clip("particle-flux", "Particle Flux", 1, 6),
      clip("aurora-drift", "Aurora Drift", 2),
      clip("deep-field", "Deep Field", 3, 5),
    ],
  },
];

export const demoCategories = Object.values(categories);
