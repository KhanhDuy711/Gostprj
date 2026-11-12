export type PackWithVideos = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  currency: string;
  coverImageKey: string;
  resolution: string;
  format: string;
  totalFileSizeMb: number;
  license: string;
  isFeatured: boolean;
  isNew: boolean;
  category: { id: string; name: string; slug: string };
  videos: {
    id: string;
    title: string;
    order: number;
    durationSeconds: number;
    thumbnailKey: string;
    previewVideoKey: string;
  }[];
};
