"use client";

import { Heart } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { Button } from "@/components/ui/button";

export function ProductActions({ productId }: { productId: string }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const inWishlist = wishlist.includes(productId);

  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => addToCart(productId)} className="min-w-44">
        Ajouter au panier
      </Button>
      <Button variant="ghost" onClick={() => toggleWishlist(productId)} className="gap-2">
        <Heart className={`h-4 w-4 ${inWishlist ? "fill-ink" : ""}`} />
        {inWishlist ? "Dans vos favoris" : "Ajouter aux favoris"}
      </Button>
    </div>
  );
}
