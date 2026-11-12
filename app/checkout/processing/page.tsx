"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useCart } from "@/lib/cart-store";

/**
 * In a real integration this page would just be Stripe's hosted checkout
 * redirecting back to /checkout/confirmation once their webhook has fired.
 * Since the mock provider has no real hosted page, this client component
 * calls our own mock webhook endpoint directly to simulate "payment
 * succeeded" arriving asynchronously and signed, then moves on — the order
 * is only ever marked PAID by that server-verified call, not by this page
 * believing itself.
 */
export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      setError("Missing order.");
      return;
    }
    fetch("/api/checkout/simulate-success", { method: "POST", body: JSON.stringify({ orderId }) })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        clear();
        router.replace(`/checkout/confirmation?orderId=${orderId}`);
      })
      .catch(() => setError("Payment could not be confirmed. Please try again or contact support."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center py-24">
        {error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="flex flex-col items-center gap-4 text-white/70">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent-purple)]" />
            <p>Confirming your payment...</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
