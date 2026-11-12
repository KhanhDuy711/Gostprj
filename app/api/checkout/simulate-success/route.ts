import { NextRequest, NextResponse } from "next/server";
import { signMockWebhook } from "@/lib/payment";

// Dev-only helper that stands in for the mock payment provider actually
// calling our webhook asynchronously after a (simulated) successful charge.
// It signs the payload exactly like the real webhook sender would, then
// posts it to /api/webhooks/mock-payment, which does the real verification
// and is the only place that marks an order PAID.
export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const payload = JSON.stringify({ orderId, status: "succeeded", at: new Date().toISOString() });
  const signature = signMockWebhook(payload);

  const res = await fetch(new URL("/api/webhooks/mock-payment", req.url), {
    method: "POST",
    headers: { "x-mock-signature": signature, "content-type": "application/json" },
    body: payload,
  });

  if (!res.ok) {
    return NextResponse.json({ error: await res.text() }, { status: res.status });
  }
  return NextResponse.json({ ok: true });
}
