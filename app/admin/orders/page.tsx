import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, payment: true, items: { include: { pack: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Orders</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-white/50">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className="text-white/80">
                <td className="px-4 py-3 font-mono text-xs text-white/50">#{order.id.slice(-8)}</td>
                <td className="px-4 py-3">
                  {order.user.name}
                  <br />
                  <span className="text-xs text-white/40">{order.user.email}</span>
                </td>
                <td className="px-4 py-3">{order.items.map((i) => i.pack.name).join(", ")}</td>
                <td className="px-4 py-3">{formatPrice(order.totalCents)}</td>
                <td className="px-4 py-3">
                  <Badge variant={order.status === "PAID" ? "new" : "outline"}>{order.status}</Badge>
                </td>
                <td className="px-4 py-3 text-white/50">{order.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-white/40">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
