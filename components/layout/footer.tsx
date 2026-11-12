import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/products", label: "All Packs" },
      { href: "/products?sort=newest", label: "New Arrivals" },
      { href: "/products?featured=1", label: "Best Sellers" },
      { href: "/categories", label: "Categories" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/license", label: "Licensing" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/auth/login", label: "Login" },
      { href: "/auth/register", label: "Register" },
      { href: "/library", label: "My Library" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-[var(--bg-secondary)]/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-blue)]" />
              <span className="text-base font-bold text-white">
                VISUAL<span className="text-gradient">BAR</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/50">
              Premium downloadable video packs for VJs, streamers, bars, and creators. Make your visuals come alive.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/50 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Visual Bar Store. All rights reserved.</p>
          <p>Built with Next.js · Prisma · Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
