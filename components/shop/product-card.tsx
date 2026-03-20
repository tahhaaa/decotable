"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { formatMAD, getSafeImageSrc } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const liked = wishlist.includes(product.id);

  return (
    <article className="group surface overflow-hidden">
      <Link href={`/shop/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
        <Image
          src={getSafeImageSrc(product.images[0])}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone">{product.categoryName}</p>
            <Link href={`/shop/${product.slug}`} className="mt-2 block font-serif text-2xl">
              {product.name}
            </Link>
          </div>
          <button
            onClick={() => toggleWishlist(product.id)}
            className="rounded-full border border-black/10 p-2"
            aria-label="Ajouter aux favoris"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-ink text-ink" : ""}`} />
          </button>
        </div>
        <p className="text-sm leading-7 text-stone">{product.shortDescription}</p>
        <div className="flex items-center gap-2 text-sm text-stone">
          <Star className="h-4 w-4 fill-beige text-beige" />
          <span>{product.rating}</span>
          <span>({product.reviewCount} avis)</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold">{formatMAD(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-sm text-stone line-through">{formatMAD(product.compareAtPrice)}</p>
            ) : null}
          </div>
          <Button onClick={() => addToCart(product.id)}>Ajouter</Button>
        </div>
      </div>
    </article>
  );
}
