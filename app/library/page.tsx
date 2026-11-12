import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, Package } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publicUrl } from "@/lib/storage";
import { signDownloadUrl } from "@/lib/signed-url";
import { formatPrice } from "@/lib/utils";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?next=/library");

  const userId = (session.user as { id: string }).id;

  const paidItems = await prisma.orderItem.findMany({
    where: { order: { userId, status: "PAID" } },
    include: { pack: { include: { videos: true } }, order: true },
    orderBy: { order: { createdAt: "desc" } },
    distinct: ["packId"],
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold text-white">My Library</h1>
          <p className="mt-1 text-sm text-white/50">Your purchased packs, ready to download.</p>

          {paidItems.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <Package className="mx-auto h-10 w-10 text-white/30" />
              <p className="mt-3 text-white/60">You haven&apos;t purchased any packs yet.</p>
              <Button className="mt-4" asChild>
                <Link href="/products">Explore Packs</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              {paidItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-36 shrink-0 overflow-hidden rounded-xl bg-black">
                    <Image src={publicUrl(item.pack.coverImageKey)} alt={item.pack.name} fill unoptimized className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.pack.slug}`} className="font-semibold text-white hover:underline">
                      {item.pack.name}
                    </Link>
                    <p className="text-xs text-white/40">
                      Purchased {item.order.createdAt.toLocaleDateString()} · {formatPrice(item.unitPriceCents)} ·{" "}
                      {item.pack.videos.length} videos
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.pack.videos.map((v) => (
                        <a
                          key={v.id}
                          href={signDownloadUrl({ key: v.originalVideoKey, userId })}
                          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 hover:border-[var(--accent-purple)]/50 hover:text-white"
                        >
                          <Download className="h-3 w-3" /> {v.title}
                        </a>
                      ))}
                    </div>
                  </div>
                  <Button asChild>
                    <a href={`/api/downloads/zip/${item.packId}`}>
                      <Download className="h-4 w-4" /> Download ZIP
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
