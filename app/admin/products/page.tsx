import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteProductAction, upsertProductAction } from "@/lib/actions/admin";
import { getCategories, getProducts } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <AdminShell currentPath="/admin/products">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Catalogue</p>
          <h1 className="section-title">Gestion des produits</h1>
        </div>
        <form action={upsertProductAction} className="surface grid gap-4 p-6 md:grid-cols-2">
          <Input name="name" placeholder="Nom du produit" required />
          <Input name="price" type="number" placeholder="Prix MAD" required />
          <Input name="shortDescription" placeholder="Description courte" required />
          <Input name="inventory" type="number" placeholder="Stock" required />
          <ImageUpload />
          <select name="categoryId" className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm" required>
            <option value="">Categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            placeholder="Description longue"
            className="min-h-[140px] rounded-[1.5rem] border border-black/10 bg-white p-4 text-sm md:col-span-2"
            required
          />
          <Button type="submit" className="md:col-span-2 md:w-fit">
            Ajouter le produit
          </Button>
        </form>
        <div className="surface overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-stone">
              <tr>
                <th className="px-6 py-4">Produit</th>
                <th className="px-6 py-4">Categorie</th>
                <th className="px-6 py-4">Prix</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-black/5">
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.categoryName}</td>
                  <td className="px-6 py-4">{formatMAD(product.price)}</td>
                  <td className="px-6 py-4">{product.inventory}</td>
                  <td className="px-6 py-4">
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <Button type="submit" variant="ghost">
                        Supprimer
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
              {!products.length ? (
                <tr>
                  <td className="px-6 py-8 text-stone" colSpan={5}>
                    Aucun produit en base actuellement.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
