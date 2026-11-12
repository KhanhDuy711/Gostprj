"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { publicUrl } from "@/lib/storage";
import { formatDuration } from "@/lib/utils";

interface Video {
  id: string;
  title: string;
  durationSeconds: number;
  thumbnailKey: string;
  previewVideoKey: string;
}

export function VideoGallery({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState<Video | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => setActive(video)}
            className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black text-left"
          >
            <Image
              src={publicUrl(video.thumbnailKey)}
              alt={video.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
                <Play className="h-4 w-4 fill-black text-black" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-2.5">
              <span className="truncate text-xs font-medium text-white">{video.title}</span>
              <span className="text-xs text-white/70">{formatDuration(video.durationSeconds)}</span>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{active?.title ?? "Preview"}</DialogTitle>
          {active && (
            <video
              key={active.id}
              controls
              autoPlay
              playsInline
              className="aspect-video w-full rounded-xl bg-black"
            >
              <source src={publicUrl(active.previewVideoKey)} type="video/mp4" />
            </video>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
