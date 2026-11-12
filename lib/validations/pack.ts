import { z } from "zod";

export const videoInputSchema = z.object({
  title: z.string().min(1).max(120),
  order: z.number().int().min(0).default(0),
  durationSeconds: z.number().int().positive(),
  thumbnailKey: z.string().min(1),
  previewVideoKey: z.string().min(1),
  originalVideoKey: z.string().min(1),
  fileSizeMb: z.number().int().min(0).default(0),
});

export const packInputSchema = z.object({
  name: z.string().min(1).max(160),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().min(1),
  priceCents: z.number().int().min(0),
  currency: z.string().default("USD"),
  coverImageKey: z.string().min(1),
  resolution: z.string().default("4K (3840x2160)"),
  format: z.string().default("MP4 (H.264)"),
  totalFileSizeMb: z.number().int().min(0).default(0),
  license: z.string().default("Standard Commercial License"),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  categoryId: z.string().min(1),
  videos: z.array(videoInputSchema).min(3, "A pack needs at least 3 videos").max(10, "A pack can contain at most 10 videos"),
});

export type PackInput = z.infer<typeof packInputSchema>;
export type VideoInput = z.infer<typeof videoInputSchema>;
