import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="mt-24 overflow-hidden border-t border-black/5 bg-gradient-to-b from-white to-[#f2e8dd]">
      <div className="container-shell py-14">
        <div className="surface relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,164,132,0.24),transparent_30%)]" />
          <div className="relative grid gap-10 md:grid-cols-4">
            <div className="space-y-4">
              <Logo />
              <p className="text-sm leading-7 text-stone">
                Decoration, vaisselle et idees cadeaux pour sublimer les intérieurs et les tables au Maroc.
              </p>
              <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.35em] text-stone">
                Livraison rapide au Maroc
              </div>
            </div>
            <div className="space-y-3 text-sm text-stone">
              <p className="font-medium text-ink">Boutique</p>
              <Link href="/shop" className="block transition hover:text-ink">Nouveautes</Link>
              <Link href="/shop?category=cat-tableware" className="block transition hover:text-ink">Vaisselle</Link>
              <Link href="/shop?category=cat-deco" className="block transition hover:text-ink">Decoration</Link>
              <Link href="/shop?category=cat-gifts" className="block transition hover:text-ink">Idees cadeaux</Link>
            </div>
            <div className="space-y-3 text-sm text-stone">
              <p className="font-medium text-ink">Service</p>
              <p>Livraison rapide au Maroc</p>
              <p>Paiement securise</p>
              <p>Notifications commande en temps reel</p>
              <p>Compatible mobile et desktop</p>
            </div>
            <div className="space-y-3 text-sm text-stone">
              <p className="font-medium text-ink">Contact</p>
              <a href="tel:0622222430" className="block transition hover:text-ink">0622222430</a>
              <a href="mailto:chahbounni2009@gmail.com" className="block transition hover:text-ink">
                chahbounni2009@gmail.com
              </a>
              <a
                href="https://www.google.fr/maps/place/Decotable/@33.9209737,-6.9062076"
                target="_blank"
                rel="noreferrer"
                className="block transition hover:text-ink"
              >
                Voir sur Google Maps
              </a>
            </div>
          </div>
          <div className="relative mt-8 border-t border-black/10 pt-6 text-xs uppercase tracking-[0.3em] text-stone">
            Decotable 2026 · Maison, art de table et cadeaux
          </div>
        </div>
      </div>
    </footer>
  );
}
