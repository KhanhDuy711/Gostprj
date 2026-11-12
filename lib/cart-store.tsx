"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  packId: string;
  slug: string;
  name: string;
  priceCents: number;
  coverImageKey: string;
}

interface CartContextValue {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (packId: string) => void;
  clear: () => void;
  subtotalCents: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "visualbar.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted cart state
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable (private mode, quota) — cart just won't persist
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      add: (item) =>
        setItems((prev) => (prev.some((i) => i.packId === item.packId) ? prev : [...prev, item])),
      remove: (packId) => setItems((prev) => prev.filter((i) => i.packId !== packId)),
      clear: () => setItems([]),
      subtotalCents: items.reduce((sum, i) => sum + i.priceCents, 0),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
