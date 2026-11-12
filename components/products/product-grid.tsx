import { ProductCard } from "@/components/products/product-card";
import type { PackWithVideos } from "@/types";

export function ProductGrid({ packs }: { packs: PackWithVideos[] }) {
  if (packs.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-white/50">
        No packs match your filters yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {packs.map((pack) => (
        <ProductCard key={pack.id} pack={pack} />
      ))}
    </div>
  );
}
