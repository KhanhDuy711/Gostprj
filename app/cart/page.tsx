"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { publicUrl } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, remove, subtotalCents } = useCart();

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <p className="text-white/60">Your cart is empty.</p>
              <Button className="mt-4" asChild>
                <Link href="/products">Explore Packs</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {items.map((item) => (
                  <div
                    key={item.packId}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-black">
                      <Image src={publicUrl(item.coverImageKey)} alt={item.name} fill unoptimized className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${item.slug}`} className="truncate font-medium text-white hover:underline">
                        {item.name}
                      </Link>
                      <p className="text-sm text-white/50">{formatPrice(item.priceCents)}</p>
                    </div>
                    <button
                      onClick={() => remove(item.packId)}
                      className="rounded-full p-2 text-white/40 hover:bg-white/5 hover:text-red-400"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h2 className="text-lg font-semibold text-white">Order Summary</h2>
                <div className="mt-4 flex justify-between text-sm text-white/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalCents)}</span>
                </div>
                <div className="mt-2 flex justify-between text-base font-bold text-white">
                  <span>Total</span>
                  <span>{formatPrice(subtotalCents)}</span>
                </div>
                <Button className="mt-6 w-full" size="lg" asChild>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
