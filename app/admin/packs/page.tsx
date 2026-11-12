import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PackRowActions } from "@/components/admin/pack-row-actions";

export default async function AdminPacksPage() {
  const packs = await prisma.productPack.findMany({
    include: { category: true, videos: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <Button asChild>
          <Link href="/admin/packs/new">
            <Plus className="h-4 w-4" /> New Pack
          </Link>
        </Button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-white/50">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Videos</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {packs.map((pack) => (
              <tr key={pack.id} className="text-white/80">
                <td className="px-4 py-3 font-medium text-white">{pack.name}</td>
                <td className="px-4 py-3">{pack.category.name}</td>
                <td className="px-4 py-3">{formatPrice(pack.priceCents)}</td>
                <td className="px-4 py-3">{pack.videos.length}</td>
                <td className="px-4 py-3">
                  <Badge variant={pack.isPublished ? "new" : "outline"}>
                    {pack.isPublished ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <PackRowActions packId={pack.id} isPublished={pack.isPublished} />
                </td>
              </tr>
            ))}
            {packs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                  No packs yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
