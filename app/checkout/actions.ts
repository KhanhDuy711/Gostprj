"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCheckout } from "@/lib/payment";

interface CheckoutItemInput {
  packId: string;
}

// A customer must be authenticated before completing a purchase (spec 6).
// Prices are re-read from the database here — never trusted from the client
// cart payload — so a tampered client can't check out at a fake price.
export async function createOrderAndCheckout(items: CheckoutItemInput[]) {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to check out.", redirectTo: "/auth/login?next=/checkout" };
  }
  if (items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const packs = await prisma.productPack.findMany({
    where: { id: { in: items.map((i) => i.packId) }, isPublished: true },
  });
  if (packs.length !== items.length) {
    return { error: "One or more items in your cart are no longer available." };
  }

  const totalCents = packs.reduce((sum, p) => sum + p.priceCents, 0);

  const order = await prisma.order.create({
    data: {
      userId: (session.user as { id: string }).id,
      totalCents,
      status: "PENDING",
      items: {
        create: packs.map((p) => ({
          packId: p.id,
          unitPriceCents: p.priceCents,
          quantity: 1,
        })),
      },
    },
  });

  const checkoutSession = await createCheckout({
    orderId: order.id,
    amountCents: totalCents,
    currency: "USD",
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: checkoutSession.provider,
      providerRef: checkoutSession.providerRef,
    },
  });

  return { redirectTo: checkoutSession.redirectUrl };
}
