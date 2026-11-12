"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { createOrderAndCheckout } from "@/app/checkout/actions";

export default function CheckoutPage() {
  const { items, subtotalCents } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    const result = await createOrderAndCheckout(items.map((i) => ({ packId: i.packId })));
    setLoading(false);
    if (result.error) {
      setError(result.error);
      if (result.redirectTo) router.push(result.redirectTo);
      return;
    }
    if (result.redirectTo) router.push(result.redirectTo);
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <h1 className="text-3xl font-bold text-white">Checkout</h1>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            {items.map((item) => (
              <div key={item.packId} className="flex justify-between py-2 text-sm">
                <span className="text-white/70">{item.name}</span>
                <span className="text-white">{formatPrice(item.priceCents)}</span>
              </div>
            ))}
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-base font-bold text-white">
              <span>Total</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-white/40">
            Payments are processed by a mock provider in this build (see lib/payment.ts). The order is
            only ever marked PAID after server-side signature verification of the webhook — never from
            a client redirect.
          </p>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

          <Button size="lg" className="mt-6 w-full" onClick={handlePay} disabled={loading || items.length === 0}>
            {loading ? "Processing..." : `Pay ${formatPrice(subtotalCents)}`}
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}
