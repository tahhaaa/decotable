import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Truck } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { getCategories, getFeaturedProducts } from "@/lib/data/store";
import { getCurrentUserRole } from "@/lib/supabase/auth";
import { getSafeImageSrc } from "@/lib/utils";

export default async function HomePage() {
  const [access, featuredProducts, featuredCategories] = await Promise.all([
    getCurrentUserRole(),
    getFeaturedProducts(),
    getCategories(),
  ]);

  const spotlightProducts = featuredProducts.slice(0, 8);
  const spotlightCategories = featuredCategories.slice(0, 3);

  return (
    <div className="bg-grain">
      <section className="container-shell grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.35em] text-stone">
            Decoration, table & cadeaux
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] text-ink sm:text-7xl">
              Decotable, tout simplement.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-stone sm:text-lg">
              Une selection claire de decoration, vaisselle et idees cadeaux avec livraison rapide partout au Maroc.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop">
              <Button className="gap-2">
                Voir les produits
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Contact</Button>
            </Link>
            {access.role === "admin" ? (
              <Link href="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
            ) : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Livraison rapide", "Rabat 20 DH, autres villes 30 DH."],
              ["Paiement simple", "Commande rapide et parcours clair."],
              ["Support direct", "Telephone et WhatsApp pour confirmer."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-black/5 bg-white/80 p-4">
                <p className="font-medium">{title}</p>
                <p className="mt-2 text-sm leading-6 text-stone">{copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="surface overflow-hidden p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[320px] overflow-hidden rounded-[2rem]">
              <Image
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                alt="Decoration Decotable"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="relative min-h-[152px] overflow-hidden rounded-[2rem]">
                <Image
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
                  alt="Art de table Decotable"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-[2rem] bg-ink p-5 text-white">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Decotable</p>
                <p className="mt-3 font-serif text-3xl">Produits en vedette</p>
                <p className="mt-3 text-sm leading-7 text-white/75">
                  Des pieces simples, nettes et faciles a commander depuis mobile ou desktop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell space-y-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.35em] text-stone">Produits</p>
            <h2 className="section-title">Nos produits en clair</h2>
          </div>
          <Link href="/shop" className="text-sm text-stone underline-offset-4 hover:underline">
            Voir toute la boutique
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {spotlightProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-6 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Categories</p>
          <h2 className="section-title">Choisissez votre univers</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {spotlightCategories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.id}`} className="surface overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={getSafeImageSrc(category.image)} alt={category.name} fill className="object-cover" />
              </div>
              <div className="space-y-2 p-5">
                <p className="font-serif text-2xl">{category.name}</p>
                <p className="text-sm leading-7 text-stone">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="surface grid gap-6 p-6 lg:grid-cols-[1fr_1fr_280px]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-stone">Pourquoi Decotable</p>
            <p className="font-serif text-4xl">Un site plus simple, plus net, plus rapide.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <Truck className="mt-1 h-5 w-5 text-beige" />
              <div>
                <p className="font-medium">Livraison nationale</p>
                <p className="text-sm leading-7 text-stone">Tarifs clairs selon la ville et estimation visible au checkout.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-beige" />
              <div>
                <p className="font-medium">Suivi simple</p>
                <p className="text-sm leading-7 text-stone">Commande, dashboard client et admin relies proprement.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-beige p-5 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Contact</p>
            <p className="mt-4 text-3xl font-semibold">0622222430</p>
            <p className="mt-3 text-sm leading-7 text-white/80">
              Une question ou une confirmation de commande ? Nous sommes joignables rapidement.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
