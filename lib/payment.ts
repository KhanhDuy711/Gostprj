/**
 * Payment abstraction.
 *
 * `PAYMENT_PROVIDER=mock` (default): `createCheckout` immediately returns a
 * "success" redirect target and fires a locally-signed webhook payload at
 * the same shape a real provider would send, so the whole
 * checkout -> webhook -> unlock-library flow is testable without any keys.
 *
 * `PAYMENT_PROVIDER=stripe`: implement `createCheckout` with
 * stripe.checkout.sessions.create(...) and verify webhooks with
 * stripe.webhooks.constructEvent(...) using STRIPE_WEBHOOK_SECRET.
 *
 * Whatever the provider, the rule never changes: an order is marked PAID
 * only inside the webhook handler, after signature verification — never
 * from a client-side "success" callback.
 */

import { createHmac, timingSafeEqual } from "crypto";

const MOCK_WEBHOOK_SECRET = process.env.DOWNLOAD_URL_SECRET ?? "dev-only-insecure-secret";
const provider = process.env.PAYMENT_PROVIDER ?? "mock";

export interface CheckoutSession {
  provider: string;
  redirectUrl: string;
  providerRef: string;
}

export async function createCheckout(params: {
  orderId: string;
  amountCents: number;
  currency: string;
}): Promise<CheckoutSession> {
  if (provider === "stripe") {
    throw new Error(
      "PAYMENT_PROVIDER=stripe is not wired up yet — implement createCheckout() with the Stripe SDK here."
    );
  }

  // Mock provider: pretend a hosted checkout page exists, send the
  // customer straight to our own "success" page, which triggers the
  // simulated webhook server-side (see app/checkout/mock-webhook route).
  const providerRef = `mock_${params.orderId}`;
  return {
    provider: "mock",
    redirectUrl: `/checkout/processing?orderId=${params.orderId}`,
    providerRef,
  };
}

export function signMockWebhook(payload: string): string {
  return createHmac("sha256", MOCK_WEBHOOK_SECRET).update(payload).digest("hex");
}

export function verifyMockWebhook(payload: string, signature: string): boolean {
  const expected = signMockWebhook(payload);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
