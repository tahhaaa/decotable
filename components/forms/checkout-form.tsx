"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useStore } from "@/components/providers/store-provider";
import { City, Product } from "@/lib/types";
import { formatMAD } from "@/lib/utils";

type CheckoutValues = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  promoCode?: string;
};

export function CheckoutForm({ products, cities }: { products: Product[]; cities: City[] }) {
  const { cart } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<CheckoutValues>();
  const city = form.watch("city");
  const selectedCity = cities.find((item) => item.name === city);

  const subtotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [cart, products],
  );

  const total = subtotal + (selectedCity?.price ?? 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const payload = {
            ...values,
            cart: cart.map((item) => {
              const product = products.find((entry) => entry.id === item.productId);
              return {
                productId: item.productId,
                productName: product?.name ?? item.productId,
                quantity: item.quantity,
                unitPrice: product?.price ?? 0,
              };
            }),
            subtotal,
          };
          await fetch("/api/email/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          setSubmitted(true);
        })}
        className="surface grid gap-4 p-6"
      >
        <Input placeholder="Nom complet" {...form.register("fullName", { required: true })} />
        <Input type="email" placeholder="Adresse email" {...form.register("email", { required: true })} />
        <Input placeholder="Telephone" {...form.register("phone", { required: true })} />
        <Input placeholder="Adresse de livraison" {...form.register("address", { required: true })} />
        <Select {...form.register("city", { required: true })}>
          <option value="">Choisir votre ville</option>
          {cities.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name} - {formatMAD(item.price)} ({item.eta})
            </option>
          ))}
        </Select>
        <Input placeholder="Code promo" {...form.register("promoCode")} />
        <Button type="submit">Confirmer la commande</Button>
        {submitted ? (
          <p className="text-sm text-green-700">Commande recue. Un email de confirmation va etre envoye.</p>
        ) : null}
      </form>
      <aside className="surface space-y-5 p-6">
        <p className="font-serif text-2xl">Votre commande</p>
        <div className="space-y-3 text-sm text-stone">
          {cart.map((item) => {
            const product = products.find((entry) => entry.id === item.productId);
            if (!product) return null;
            return (
              <div key={product.id} className="flex justify-between">
                <span>
                  {product.name} x {item.quantity}
                </span>
                <span>{formatMAD(product.price * item.quantity)}</span>
              </div>
            );
          })}
          <div className="flex justify-between border-t border-black/10 pt-3">
            <span>Sous-total</span>
            <span>{formatMAD(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            <span>{selectedCity ? formatMAD(selectedCity.price) : "--"}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatMAD(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
