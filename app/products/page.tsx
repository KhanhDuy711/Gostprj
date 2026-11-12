import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { getAllPacks, getCategories } from "@/lib/packs";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: "price_asc" | "price_desc" | "newest"; featured?: string }>;
}) {
  const sp = await searchParams;
  const [packs, categories] = await Promise.all([
    getAllPacks({ categorySlug: sp.category, query: sp.q, sort: sp.sort }),
    getCategories(),
  ]);

  const visible = sp.featured ? packs.filter((p) => p.isFeatured) : packs;

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold text-white">Explore Packs</h1>
          <p className="mt-2 text-sm text-white/50">
            {visible.length} pack{visible.length === 1 ? "" : "s"} available
          </p>

          <ProductFilters categories={categories} current={sp} />

          <div className="mt-8">
            <ProductGrid packs={visible} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
