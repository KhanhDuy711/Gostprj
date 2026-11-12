"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, LibraryBig } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Explore Packs" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { items } = useCart();
  const { data: session } = useSession();

  return (
    <header className="glass-nav sticky top-0 z-40 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-blue)]" />
          <span className="text-lg font-bold tracking-tight text-white">
            VISUAL<span className="text-gradient">BAR</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center sm:flex">
            {searchOpen ? (
              <Input
                autoFocus
                placeholder="Search packs..."
                className="w-56"
                onBlur={() => setSearchOpen(false)}
              />
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} aria-label="Search">
                <Search className="h-4.5 w-4.5" />
              </Button>
            )}
          </div>

          <Button variant="ghost" size="icon" asChild aria-label="Cart" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-4.5 w-4.5" />
              {items.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[var(--accent-purple)] text-[10px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </Link>
          </Button>

          {session?.user ? (
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/library">
                <LibraryBig className="h-3.5 w-3.5" />
                My Library
              </Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/auth/login">
                <User className="h-3.5 w-3.5" />
                Login
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/5 transition-[max-height] duration-300 md:hidden",
          mobileOpen ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/auth/login" className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/5">
            Login / Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
