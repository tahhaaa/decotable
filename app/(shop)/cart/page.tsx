import { CartClient } from "@/components/shop/cart-client";
import { getCities, getProducts } from "@/lib/data/store";

export default async function CartPage() {
  const [products, cities] = await Promise.all([getProducts(), getCities()]);

  return (
    <div className="container-shell space-y-8 py-12">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-stone">Panier</p>
        <h1 className="section-title">Finalisez votre selection</h1>
      </div>
      <CartClient products={products} cities={cities} />
    </div>
  );
}
