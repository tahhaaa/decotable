import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deletePromotionAction, upsertPromotionAction } from "@/lib/actions/admin";
import { getPromotions } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

export default async function AdminPromotionsPage() {
  const promotions = await getPromotions({ fallbackToMock: false });

  return (
    <AdminShell currentPath="/admin/promotions">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Marketing</p>
          <h1 className="section-title">Promotions & remises</h1>
        </div>
        <form action={upsertPromotionAction} className="surface grid gap-4 p-6 md:grid-cols-4">
          <Input name="label" placeholder="Nom campagne" required />
          <Input name="code" placeholder="Code promo" required />
          <select name="type" className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm">
            <option value="percentage">Pourcentage</option>
            <option value="fixed">Montant fixe</option>
          </select>
          <Input name="value" type="number" placeholder="Valeur" required />
          <Button type="submit" className="md:col-span-4 md:w-fit">
            Ajouter la promotion
          </Button>
        </form>
        <div className="grid gap-4 md:grid-cols-2">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="surface p-6">
              <p className="font-medium">{promotion.label}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-stone">{promotion.code}</p>
              <p className="mt-4 text-sm text-stone">
                {promotion.type === "percentage" ? `${promotion.value}%` : formatMAD(promotion.value)} de reduction
              </p>
              <form action={deletePromotionAction} className="mt-4">
                <input type="hidden" name="id" value={promotion.id} />
                <Button type="submit" variant="ghost">
                  Supprimer
                </Button>
              </form>
            </div>
          ))}
          {!promotions.length ? (
            <div className="surface p-6 text-sm text-stone">Aucune promotion active en base.</div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
