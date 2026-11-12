import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [revenue, orderCount, productCount, customerCount, bestSellers] = await Promise.all([
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true } }),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.productPack.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.orderItem.groupBy({
      by: ["packId"],
      _count: { packId: true },
      orderBy: { _count: { packId: "desc" } },
      take: 5,
    }),
  ]);

  const bestSellerPacks = await prisma.productPack.findMany({
    where: { id: { in: bestSellers.map((b) => b.packId) } },
  });

  const stats = [
    { label: "Total revenue", value: formatPrice(revenue._sum.totalCents ?? 0) },
    { label: "Total orders", value: orderCount },
    { label: "Total products", value: productCount },
    { label: "Total customers", value: customerCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent>
              <p className="text-xs text-white/40">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-white">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold text-white">Best-selling packs</h2>
      <div className="mt-4 space-y-2">
        {bestSellerPacks.length === 0 && <p className="text-sm text-white/40">No sales yet.</p>}
        {bestSellerPacks.map((pack) => {
          const count = bestSellers.find((b) => b.packId === pack.id)?._count.packId ?? 0;
          return (
            <div key={pack.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
              <span className="text-sm text-white">{pack.name}</span>
              <span className="text-sm text-white/50">{count} sold</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
