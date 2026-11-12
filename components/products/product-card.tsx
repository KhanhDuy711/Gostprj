"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { publicUrl } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PackWithVideos } from "@/types";

export function ProductCard({ pack }: { pack: PackWithVideos }) {
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Section 4: use the first video in the pack as the default hover preview.
  const previewVideo = pack.videos[0];

  const startPreview = () => {
    setHovering(true);
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {
        /* autoplay can be blocked until user gesture on some browsers — fine, cover stays visible */
      });
    }
  };

  const stopPreview = () => {
    setHovering(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  // Mobile: no hover, so tap toggles the preview instead.
  const handleTap = () => {
    if (hovering) stopPreview();
    else startPreview();
  };

  return (
    <Link
      href={`/products/${pack.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--bg-secondary)]/60 transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={startPreview}
      onMouseLeave={stopPreview}
      onTouchStart={(e) => {
        e.preventDefault();
        handleTap();
      }}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <Image
          src={publicUrl(pack.coverImageKey)}
          alt={pack.name}
          fill
          unoptimized
          className={cn(
            "object-cover transition-opacity duration-500",
            hovering ? "opacity-0" : "opacity-100"
          )}
        />
        {previewVideo && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={publicUrl(previewVideo.thumbnailKey)}
            // Lazy: the <source> only loads once the browser decides to buffer,
            // and we never touch originalVideoKey here — only the watermarked preview.
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              hovering ? "opacity-100" : "opacity-0"
            )}
          >
            <source src={publicUrl(previewVideo.previewVideoKey)} type="video/mp4" />
          </video>
        )}

        <div className="absolute left-3 top-3 flex gap-2">
          {pack.isFeatured && <Badge variant="featured">Featured</Badge>}
          {pack.isNew && <Badge variant="new">New</Badge>}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white/80 backdrop-blur-sm">
          <Play className="h-3 w-3" />
          {pack.videos.length} videos
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-white group-hover:text-gradient">
            {pack.name}
          </h3>
          <p className="mt-0.5 text-xs text-white/50">{pack.category.name}</p>
        </div>
        <span className="shrink-0 text-base font-bold text-white">
          {formatPrice(pack.priceCents, pack.currency)}
        </span>
      </div>
    </Link>
  );
}
