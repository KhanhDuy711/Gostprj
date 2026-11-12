import Image from "next/image";
import { notFound } from "next/navigation";
import { Film, HardDrive, Monitor, FileCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { VideoGallery } from "@/components/products/video-gallery";
import { AddToCart } from "@/components/products/add-to-cart";
import { getPackBySlug } from "@/lib/packs";
import { publicUrl } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pack = await getPackBySlug(slug);
  if (!pack) notFound();

  const specs = [
    { icon: Film, label: "Videos", value: `${pack.videos.length} clips` },
    { icon: Monitor, label: "Resolution", value: pack.resolution },
    { icon: HardDrive, label: "Total size", value: `${pack.totalFileSizeMb} MB` },
    { icon: FileCheck, label: "Format", value: pack.format },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
                <Image
                  src={publicUrl(pack.coverImageKey)}
                  alt={pack.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="flex gap-2">
                {pack.isFeatured && <Badge variant="featured">Featured</Badge>}
                {pack.isNew && <Badge variant="new">New</Badge>}
                <Badge variant="outline">{pack.category.name}</Badge>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-white">{pack.name}</h1>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{pack.description}</p>

              <div className="mt-6 text-3xl font-extrabold text-white">
                {formatPrice(pack.priceCents, pack.currency)}
              </div>

              <div className="mt-6">
                <AddToCart
                  pack={{
                    id: pack.id,
                    slug: pack.slug,
                    name: pack.name,
                    priceCents: pack.priceCents,
                    coverImageKey: pack.coverImageKey,
                  }}
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-start gap-2.5">
                    <spec.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-blue)]" />
                    <div>
                      <p className="text-xs text-white/40">{spec.label}</p>
                      <p className="text-sm font-medium text-white">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-white/40">{pack.license}</p>
            </div>
          </div>

          <div className="mt-14">
            <h2 className="text-xl font-bold text-white">Video Gallery</h2>
            <p className="mt-1 text-sm text-white/50">
              Preview clips are watermarked. Purchase to unlock the original, watermark-free files.
            </p>
            <div className="mt-6">
              <VideoGallery videos={pack.videos} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
