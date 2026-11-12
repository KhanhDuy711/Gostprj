import Link from "next/link";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { getFeaturedPacks, getAllPacks, getCategories } from "@/lib/packs";

export default async function HomePage() {
  const [featured, allPacks, categories] = await Promise.all([
    getFeaturedPacks(),
    getAllPacks(),
    getCategories(),
  ]);
  const newArrivals = allPacks.filter((p) => p.isNew);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,var(--accent-purple)_0%,transparent_60%)] opacity-30" />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-blue)]" />
              New drops every week
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              MAKE YOUR <span className="text-gradient">VISUALS</span>
              <br /> COME ALIVE
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-white/60 sm:text-lg">
              Premium downloadable video packs for VJs, bars, streamers, and creators.
              Cinematic loops, instant delivery, royalty-free licensing.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/products">
                  Explore Packs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-white/5 bg-white/[0.02] py-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 text-sm text-white/60 sm:px-6">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-[var(--accent-blue)]" /> Instant digital delivery
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--accent-purple)]" /> Secure checkout
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--accent-blue)]" /> 4K source files
            </span>
          </div>
        </section>

        {/* Featured */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Featured Packs</h2>
              <p className="mt-1 text-sm text-white/50">Hand-picked visuals for your next show.</p>
            </div>
            <Link href="/products?featured=1" className="text-sm font-medium text-[var(--accent-blue)] hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-6">
            <ProductGrid packs={featured} />
          </div>
        </section>

        {/* All packs */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">All Packs</h2>
              <p className="mt-1 text-sm text-white/50">Browse the full catalog.</p>
            </div>
            <Link href="/products" className="text-sm font-medium text-[var(--accent-blue)] hover:underline">
              Search & filter
            </Link>
          </div>
          <div className="mt-6">
            <ProductGrid packs={allPacks} />
          </div>
        </section>

        {newArrivals.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
            <h2 className="text-2xl font-bold text-white">New Arrivals</h2>
            <div className="mt-6">
              <ProductGrid packs={newArrivals} />
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-white">Categories</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--accent-purple)]/10 to-[var(--accent-blue)]/10 p-6 text-center transition-colors hover:border-[var(--accent-purple)]/40"
              >
                <span className="text-sm font-semibold text-white group-hover:text-gradient">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white">Stay in the loop</h2>
          <p className="mt-2 text-sm text-white/50">
            Get notified about new packs and seasonal discounts. No spam.
          </p>
          <form className="mx-auto mt-6 flex max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="h-11 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/40 outline-none focus-visible:border-[var(--accent-purple)]/60"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
