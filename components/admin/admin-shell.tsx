import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  ["Vue globale", "/admin"],
  ["Produits", "/admin/products"],
  ["Categories", "/admin/categories"],
  ["Commandes", "/admin/orders"],
  ["Clients", "/admin/customers"],
  ["Charges", "/admin/expenses"],
  ["Livraison", "/admin/cities"],
  ["Promotions", "/admin/promotions"],
];

export function AdminShell({
  currentPath,
  children,
}: {
  currentPath: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-shell grid gap-6 py-8 lg:grid-cols-[280px_1fr] lg:gap-8 lg:py-12">
      <aside className="surface h-fit overflow-hidden p-4 lg:sticky lg:top-6">
        <div className="flex items-center justify-between gap-4 px-3 py-2">
          <p className="font-serif text-3xl">Admin</p>
          <span className="rounded-full bg-beige/15 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-stone">
            Decotable
          </span>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible lg:pb-0">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "whitespace-nowrap rounded-2xl px-4 py-3 text-sm transition lg:px-3",
                currentPath === href ? "bg-ink text-white" : "text-stone hover:bg-black/[0.04] hover:text-ink",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
