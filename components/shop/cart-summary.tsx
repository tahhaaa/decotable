"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import { formatMAD } from "@/lib/utils";

export function CartSummary({
  subtotal,
  shipping,
  discount,
}: {
  subtotal: number;
  shipping: number;
  discount: number;
}) {
  const total = Math.max(subtotal + shipping - discount, 0);

  return (
    <aside className="surface h-fit space-y-5 p-6">
      <p className="font-serif text-2xl">Recapitulatif</p>
      <div className="space-y-3 text-sm text-stone">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{formatMAD(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Livraison</span>
          <span>{shipping ? formatMAD(shipping) : "Selectionnez votre ville"}</span>
        </div>
        <div className="flex justify-between">
          <span>Remise</span>
          <span>- {formatMAD(discount)}</span>
        </div>
      </div>
      <div className="flex justify-between border-t border-black/10 pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>{formatMAD(total)}</span>
      </div>
      <Link href="/checkout" className="block">
        <Button className="w-full">Passer au paiement</Button>
      </Link>
    </aside>
  );
}
