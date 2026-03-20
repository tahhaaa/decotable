"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CartSummary } from "@/components/shop/cart-summary";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useStore } from "@/components/providers/store-provider";
import { City, Product } from "@/lib/types";
import { formatMAD, getSafeImageSrc } from "@/lib/utils";

export function CartClient({ products, cities }: { products: Product[]; cities: City[] }) {
  const { cart, updateCartItem, removeFromCart } = useStore();
  const [city, setCity] = useState("");
  const selectedCity = cities.find((item) => item.name === city);

  const items = useMemo(
    () =>
      cart
        .map((item) => ({
          cart: item,
          product: products.find((product) => product.id === item.productId),
        }))
        .filter((item): item is { cart: typeof cart[number]; product: Product } => Boolean(item.product)),
    [cart, products],
  );

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.cart.quantity, 0);
  const discount = subtotal > 1500 ? 75 : 0;

  if (!items.length) {
    return (
      <div className="surface mx-auto max-w-2xl space-y-4 p-10 text-center">
        <p className="font-serif text-4xl">Votre panier est vide</p>
        <p className="text-sm leading-7 text-stone">Explorez nos collections premium et ajoutez vos pieces preferees.</p>
        <Link href="/shop">
          <Button>Retour a la boutique</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        {items.map(({ cart: item, product }) => (
          <article key={product.id} className="surface flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="relative h-28 w-full overflow-hidden rounded-[1.5rem] sm:w-28">
              <Image src={getSafeImageSrc(product.images[0])} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-serif text-2xl">{product.name}</p>
              <p className="text-sm text-stone">{product.shortDescription}</p>
              <p className="mt-2 font-medium">{formatMAD(product.price)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={item.quantity}
                onChange={(event) => updateCartItem(product.id, Number(event.target.value))}
                className="w-24"
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
              <Button variant="ghost" onClick={() => removeFromCart(product.id)}>
                Supprimer
              </Button>
            </div>
          </article>
        ))}
        <div className="surface p-6">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-stone">Livraison</p>
          <Select value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="">Choisir une ville</option>
            {cities.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name} - {formatMAD(item.price)} ({item.eta})
              </option>
            ))}
          </Select>
        </div>
      </div>
      <CartSummary subtotal={subtotal} shipping={selectedCity?.price ?? 0} discount={discount} />
    </div>
  );
}
