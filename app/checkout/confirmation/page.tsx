import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  const order = orderId
    ? await prisma.order.findUnique({ where: { id: orderId }, include: { items: { include: { pack: true } } } })
    : null;

  return (
    <>
      <Header />
      <main className="flex flex-1 items-center justify-center py-20">
        <div className="mx-auto max-w-md px-4 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-[var(--accent-blue)]" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            {order?.status === "PAID" ? "Order confirmed!" : "Order received"}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {order
              ? `Order #${order.id.slice(-8)} · ${formatPrice(order.totalCents)}`
              : "We could not find that order."}
          </p>
          <p className="mt-1 text-sm text-white/50">
            Your packs are now available in My Library, ready to download.
          </p>
          <Button className="mt-6" size="lg" asChild>
            <Link href="/library">Go to My Library</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
