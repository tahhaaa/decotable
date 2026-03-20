import { ProductCard } from "@/components/shop/product-card";
import { getCategories, getProducts } from "@/lib/data/store";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const [items, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  return (
    <div className="container-shell space-y-10 py-12">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-stone">Boutique</p>
        <h1 className="section-title">Selection Decotable</h1>
        <p className="section-copy">
          Filtrez par univers, recherchez une reference precise et composez votre table ou votre espace avec des pieces premium.
        </p>
      </div>

      <form className="surface grid gap-4 p-5 md:grid-cols-[1fr_280px]">
        <Input name="search" defaultValue={searchParams.search} placeholder="Rechercher un produit, une matiere, une collection..." />
        <Select name="category" defaultValue={searchParams.category}>
          <option value="">Toutes les categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </form>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
