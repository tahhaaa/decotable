import { CheckoutForm } from "@/components/forms/checkout-form";
import { getCities, getProducts } from "@/lib/data/store";

export default async function CheckoutPage() {
  const [products, cities] = await Promise.all([getProducts(), getCities()]);

  return (
    <div className="container-shell space-y-8 py-12">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-stone">Checkout</p>
        <h1 className="section-title">Livraison et paiement</h1>
      </div>
      <CheckoutForm products={products} cities={cities} />
    </div>
  );
}
