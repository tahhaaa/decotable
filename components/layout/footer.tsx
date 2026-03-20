import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-black/5 bg-white">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-4">
        <div className="space-y-4">
          <p className="font-serif text-2xl">Decotable</p>
          <p className="text-sm leading-7 text-stone">
            Decoration, vaisselle et idees cadeaux pour sublimer les intérieurs et les tables au Maroc.
          </p>
        </div>
        <div className="space-y-3 text-sm text-stone">
          <p className="font-medium text-ink">Boutique</p>
          <Link href="/shop">Nouveautes</Link>
          <Link href="/shop?category=cat-tableware">Vaisselle</Link>
          <Link href="/shop?category=cat-deco">Decoration</Link>
        </div>
        <div className="space-y-3 text-sm text-stone">
          <p className="font-medium text-ink">Service</p>
          <p>Livraison rapide au Maroc</p>
          <p>Paiement securise</p>
          <p>Retours sous 7 jours</p>
        </div>
        <div className="space-y-3 text-sm text-stone">
          <p className="font-medium text-ink">Contact</p>
          <a href="tel:0622222430">0622222430</a>
          <a
            href="https://www.google.fr/maps/place/Decotable/@33.9209737,-6.9062076"
            target="_blank"
            rel="noreferrer"
          >
            Voir sur Google Maps
          </a>
        </div>
      </div>
    </footer>
  );
}
