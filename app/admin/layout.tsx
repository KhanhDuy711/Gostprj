import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, ArrowLeft } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packs", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      <aside className="hidden w-60 shrink-0 border-r border-white/5 bg-[var(--bg-secondary)]/40 p-5 sm:block">
        <Link href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to store
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-white/30">Admin</p>
        <nav className="mt-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
