"use client";

import Link from "next/link";
import { Heart, Menu, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { useStore } from "@/components/providers/store-provider";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/shop", label: "Boutique" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard", label: "Mon compte" },
];

export function Header() {
  const { cartCount, wishlist } = useStore();

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/90 backdrop-blur">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link href="/" className="transition-transform duration-300 hover:scale-[1.01]">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="link-luxe text-stone transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/shop" className="rounded-full border border-black/10 bg-white p-3 transition hover:-translate-y-0.5 md:hidden">
            <Menu className="h-4 w-4" />
          </Link>
          <Link href="/shop" className="rounded-full border border-black/10 bg-white p-3 transition hover:-translate-y-0.5">
            <Heart className="h-4 w-4" />
            <span className="sr-only">{wishlist.length} favoris</span>
          </Link>
          <Link href="/cart" className="relative rounded-full border border-black/10 bg-ink p-3 text-white transition hover:-translate-y-0.5">
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-beige px-1 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
