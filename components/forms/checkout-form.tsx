"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, PackageCheck, Truck, Wallet } from "lucide-react";
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
  const { cart, clearCart } = useStore();
  const [submitted, setSubmitted] = useState<null | { orderId?: string; status: string; eta: string; warning?: string | null }>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
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

  const trackingSteps = [
    { label: "Commande envoyee", icon: Wallet },
    { label: "Validation Decotable", icon: CheckCircle2 },
    { label: "Preparation", icon: PackageCheck },
    { label: "Expedition", icon: Truck },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={form.handleSubmit((values) =>
          startTransition(async () => {
            setError("");
            if (!cart.length) {
              setError("Votre panier est vide.");
              return;
            }
            if (!values.city) {
              setError("Choisissez une ville de livraison.");
              return;
            }
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
            try {
              const response = await fetch("/api/email/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              const result = await response.json();
              if (!response.ok || !result.ok) {
                setError(result.message || "La commande n'a pas pu etre envoyee.");
                return;
              }
              setSubmitted({
                orderId: result.orderId,
                status: result.status || "pending",
                eta: result.eta || selectedCity?.eta || "24-48h",
                warning: result.warning || null,
              });
              clearCart();
            } catch {
              setError("Erreur reseau pendant l'envoi de la commande.");
            }
          }),
        )}
        className="surface grid gap-4 p-6"
      >
        <Input placeholder="Nom complet" {...form.register("fullName", { required: true })} />
        {form.formState.errors.fullName ? <p className="text-sm text-red-600">Le nom complet est obligatoire.</p> : null}
        <Input type="email" placeholder="Adresse email" {...form.register("email", { required: true })} />
        {form.formState.errors.email ? <p className="text-sm text-red-600">L&apos;email est obligatoire.</p> : null}
        <Input placeholder="Telephone" {...form.register("phone", { required: true })} />
        {form.formState.errors.phone ? <p className="text-sm text-red-600">Le telephone est obligatoire.</p> : null}
        <Input placeholder="Adresse de livraison" {...form.register("address", { required: true })} />
        {form.formState.errors.address ? <p className="text-sm text-red-600">L&apos;adresse est obligatoire.</p> : null}
        <Select {...form.register("city", { required: true })}>
          <option value="">Choisir votre ville</option>
          {cities.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name} - {formatMAD(item.price)} ({item.eta})
            </option>
          ))}
        </Select>
        {form.formState.errors.city ? <p className="text-sm text-red-600">La ville est obligatoire.</p> : null}
        <Input placeholder="Code promo" {...form.register("promoCode")} />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Envoi en cours..." : "Confirmer la commande"}
        </Button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
      <aside className="surface space-y-5 p-6">
        {submitted ? (
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-beige/40 bg-beige/10 p-6 text-center fade-up">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-beige text-white shadow-lg">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="mt-4 font-serif text-3xl">Commande envoyee</p>
              <p className="mt-2 text-sm leading-7 text-stone">
                Votre commande a bien ete recue par Decotable.
              </p>
              {submitted.orderId ? (
                <p className="mt-3 text-sm font-medium text-ink">Reference: {submitted.orderId}</p>
              ) : null}
              <p className="mt-2 text-sm text-stone">Livraison estimee: {submitted.eta}</p>
              {submitted.warning ? (
                <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {submitted.warning}
                </p>
              ) : null}
            </div>

            <div className="space-y-4">
              <p className="font-serif text-2xl">Suivi de commande</p>
              {trackingSteps.map((step, index) => {
                const Icon = step.icon;
                const active = index === 0;
                return (
                  <div key={step.label} className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${active ? "bg-ink text-white" : "bg-black/5 text-stone"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-medium ${active ? "text-ink" : "text-stone"}`}>{step.label}</p>
                      <p className="text-sm text-stone">
                        {active ? "Etape active maintenant." : "Cette etape arrivera ensuite."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/dashboard">
              <Button className="w-full">Voir le suivi dans mon espace</Button>
            </Link>
          </div>
        ) : (
          <>
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
          </>
        )}
      </aside>
    </div>
  );
}
