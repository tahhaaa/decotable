import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { applyDefaultCityPricingAction, updateCityAction } from "@/lib/actions/admin";
import { getCities } from "@/lib/data/store";

export default async function AdminCitiesPage() {
  const cities = await getCities({ fallbackToMock: false });

  return (
    <AdminShell currentPath="/admin/cities">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Livraison</p>
          <h1 className="section-title">Tarifs par ville</h1>
        </div>
        <form action={applyDefaultCityPricingAction}>
          <Button type="submit" variant="ghost">
            Appliquer Rabat 20 DH et toutes les autres villes 30 DH
          </Button>
        </form>
        <div className="grid gap-4">
          {cities.map((city) => (
            <form key={city.id} action={updateCityAction} className="surface grid gap-4 p-6 md:grid-cols-[1fr_180px_180px_160px] md:items-center">
              <input type="hidden" name="id" value={city.id} />
              <p className="font-medium">{city.name}</p>
              <input
                name="price"
                type="number"
                defaultValue={city.price}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm"
              />
              <input
                name="eta"
                defaultValue={city.eta}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm"
              />
              <Button type="submit">Mettre a jour</Button>
            </form>
          ))}
          {!cities.length ? (
            <div className="surface p-6 text-sm text-stone">
              Aucune ville chargee en base. Ajoutez vos villes du Maroc dans Supabase pour activer la livraison live.
            </div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
