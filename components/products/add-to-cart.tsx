"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

export function AddToCart({
  pack,
}: {
  pack: { id: string; slug: string; name: string; priceCents: number; coverImageKey: string };
}) {
  const { add, items } = useCart();
  const router = useRouter();
  const inCart = items.some((i) => i.packId === pack.id);

  function handleAdd() {
    add({
      packId: pack.id,
      slug: pack.slug,
      name: pack.name,
      priceCents: pack.priceCents,
      coverImageKey: pack.coverImageKey,
    });
    toast.success(`${pack.name} added to cart`);
  }

  function handleBuyNow() {
    if (!inCart) handleAdd();
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button size="lg" variant="outline" onClick={handleAdd} disabled={inCart} className="flex-1">
        <ShoppingCart className="h-4 w-4" />
        {inCart ? "In cart" : "Add to Cart"}
      </Button>
      <Button size="lg" onClick={handleBuyNow} className="flex-1">
        <Zap className="h-4 w-4" />
        Buy Now
      </Button>
    </div>
  );
}
