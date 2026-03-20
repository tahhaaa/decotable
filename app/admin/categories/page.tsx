import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteCategoryAction, upsertCategoryAction } from "@/lib/actions/admin";
import { getCategories } from "@/lib/data/store";

export default async function AdminCategoriesPage() {
  const categories = await getCategories({ fallbackToMock: false });

  return (
    <AdminShell currentPath="/admin/categories">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Structure</p>
          <h1 className="section-title">Gestion des categories</h1>
        </div>
        <form action={upsertCategoryAction} className="surface grid gap-4 p-6 md:grid-cols-2">
          <Input name="name" placeholder="Nom de la categorie" required />
          <ImageUpload inputName="image" folder="categories" />
          <textarea
            name="description"
            placeholder="Description"
            className="min-h-[140px] rounded-[1.5rem] border border-black/10 bg-white p-4 text-sm md:col-span-2"
            required
          />
          <Button type="submit" className="md:w-fit">
            Ajouter la categorie
          </Button>
        </form>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="surface p-6">
              <p className="font-serif text-3xl">{category.name}</p>
              <p className="mt-3 text-sm leading-7 text-stone">{category.description}</p>
              <form action={deleteCategoryAction} className="mt-4">
                <input type="hidden" name="id" value={category.id} />
                <Button type="submit" variant="ghost">
                  Supprimer
                </Button>
              </form>
            </div>
          ))}
          {!categories.length ? (
            <div className="surface p-6 text-sm text-stone">Aucune categorie en base actuellement.</div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
