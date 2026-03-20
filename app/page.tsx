import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Truck } from "lucide-react";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { getCategories, getFeaturedProducts } from "@/lib/data/store";

export default async function HomePage() {
  const [featuredProducts, featuredCategories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="bg-grain">
      <section className="container-shell grid min-h-[calc(100vh-5rem)] items-center gap-10 py-16 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-8">
          <span className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-xs uppercase tracking-[0.35em] text-stone">
            Livraison rapide partout au Maroc
          </span>
          <div className="space-y-6">
            <h1 className="max-w-3xl font-serif text-5xl leading-[0.95] text-ink sm:text-7xl">
              La maison s&apos;habille d&apos;une elegance simple.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone">
              Decotable imagine une experience d&apos;achat premium autour de la decoration, de la vaisselle et des cadeaux pour recevoir avec style.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop">
              <Button className="gap-2">
                Explorer la boutique
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost">Nous contacter</Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Produits premium", "Selection artisanale et tendances luxe."],
              ["Paiement securise", "Parcours d'achat optimise mobile-first."],
              ["Livraison nationale", "Tarifs dynamiques selon votre ville."],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-3xl border border-black/5 bg-white/70 p-5">
                <p className="font-medium">{title}</p>
                <p className="mt-2 text-sm leading-6 text-stone">{copy}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="surface relative min-h-[620px] overflow-hidden p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-beige/20 via-transparent to-transparent" />
          <div className="grid h-full gap-6 sm:grid-cols-2">
            <div className="relative overflow-hidden rounded-[2rem]">
              <Image
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
                alt="Decoration premium"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="relative h-72 overflow-hidden rounded-[2rem]">
                <Image
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
                  alt="Art de table"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-[2rem] bg-ink p-6 text-white">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Selection du moment</p>
                <p className="mt-3 font-serif text-3xl">Capsule beige & noir</p>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  Des textures sablees, des lignes nettes et un art de recevoir inspire des interieurs contemporains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-stone">Collections</p>
            <h2 className="section-title">Nos univers signatures</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.id}`} className="surface group overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image src={category.image} alt={category.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="space-y-3 p-6">
                <p className="font-serif text-3xl">{category.name}</p>
                <p className="text-sm leading-7 text-stone">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Best sellers</p>
          <h2 className="section-title">Les pieces les plus aimees</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="surface grid gap-8 p-8 lg:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-stone">Promesses Decotable</p>
            <p className="mt-3 font-serif text-4xl">Une experience premium du clic a la livraison.</p>
          </div>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Truck className="mt-1 h-5 w-5 text-beige" />
              <div>
                <p className="font-medium">Livraison nationale</p>
                <p className="text-sm leading-7 text-stone">Tarification par ville pour un panier transparent des la commande.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="mt-1 h-5 w-5 text-beige" />
              <div>
                <p className="font-medium">Parcours fluide</p>
                <p className="text-sm leading-7 text-stone">Wishlist, panier synchronise et suivi de commande depuis votre espace client.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2rem] bg-beige p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">Contact</p>
            <p className="mt-4 text-3xl font-semibold">0622222430</p>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Une question produit, une commande entreprise ou une demande cadeau ? Notre equipe vous accompagne.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
