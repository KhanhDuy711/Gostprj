"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  slug: string;
  name: string;
}

export function ProductFilters({
  categories,
  current,
}: {
  categories: Category[];
  current: { category?: string; q?: string; sort?: string; featured?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [query, setQuery] = useState(current.q ?? "");

  function push(next: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = { ...current, ...next };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          push({ q: query || undefined });
        }}
        className="relative w-full sm:max-w-xs"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search packs..."
          className="pl-10"
        />
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={!current.category ? "default" : "outline"}
          onClick={() => push({ category: undefined })}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.slug}
            size="sm"
            variant={current.category === cat.slug ? "default" : "outline"}
            onClick={() => push({ category: cat.slug })}
          >
            {cat.name}
          </Button>
        ))}

        <select
          value={current.sort ?? ""}
          onChange={(e) => push({ sort: e.target.value || undefined })}
          className={cn(
            "h-8 rounded-full border border-white/15 bg-white/[0.03] px-3.5 text-xs font-medium text-white outline-none"
          )}
        >
          <option value="" className="bg-[#15151D]">Sort: Newest</option>
          <option value="price_asc" className="bg-[#15151D]">Price: Low to High</option>
          <option value="price_desc" className="bg-[#15151D]">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
