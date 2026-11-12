import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMockWebhook } from "@/lib/payment";

// Stand-in for a real provider's webhook endpoint (e.g. Stripe's
// /api/webhooks/stripe). The signature is verified BEFORE any order is
// touched — this is the only place an order transitions to PAID. A
// frontend "success" redirect never does this by itself (spec 6 & 11).
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-mock-signature") ?? "";

  if (!verifyMockWebhook(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody) as { orderId: string };

  const order = await prisma.order.findUnique({ where: { id: event.orderId }, include: { payment: true } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "PAID") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  await prisma.$transaction([
    prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } }),
    prisma.payment.update({
      where: { orderId: order.id },
      data: { signatureValid: true, paidAt: new Date(), rawWebhookPayload: JSON.parse(rawBody) },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
