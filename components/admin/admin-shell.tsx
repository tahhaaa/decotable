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
    <div className="container-shell grid gap-8 py-12 lg:grid-cols-[280px_1fr]">
      <aside className="surface h-fit p-4">
        <p className="px-3 py-2 font-serif text-3xl">Admin</p>
        <nav className="mt-4 grid gap-1">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-2xl px-3 py-3 text-sm transition",
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
