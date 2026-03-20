import { AdminShell } from "@/components/admin/admin-shell";
import { AnalyticsCards } from "@/components/admin/analytics-cards";
import { ReportFilters } from "@/components/admin/report-filters";
import { PushOptIn } from "@/components/forms/push-optin";
import { Button } from "@/components/ui/button";
import { resetSiteDataAction } from "@/lib/actions/admin";
import { getCategories, getCities, getDashboardSnapshot, getProducts, getPromotions } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { dateFrom?: string; dateTo?: string };
}) {
  const [snapshot, products, categories, cities, promotions] = await Promise.all([
    getDashboardSnapshot({
      dateFrom: searchParams.dateFrom,
      dateTo: searchParams.dateTo,
    }, { fallbackToMock: false }),
    getProducts(undefined, { fallbackToMock: false }),
    getCategories({ fallbackToMock: false }),
    getCities({ fallbackToMock: false }),
    getPromotions({ fallbackToMock: false }),
  ]);

  return (
    <AdminShell currentPath="/admin">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-stone">Administration</p>
        <h1 className="section-title">Pilotage Decotable</h1>
        <p className="section-copy">
          Revenus, trafic, stock, promotions et commandes dans un panneau simple a naviguer sur mobile et desktop.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <PushOptIn />
        <form action={resetSiteDataAction}>
          <Button type="submit" variant="ghost" className="w-full lg:w-auto">
            Reinitialiser les donnees du site
          </Button>
        </form>
      </div>
      <form>
        <ReportFilters dateFrom={searchParams.dateFrom} dateTo={searchParams.dateTo} />
      </form>
      {snapshot.source !== "live" ? (
        <div className="surface border border-amber-300/60 bg-amber-50 p-4 text-sm text-stone">
          L&apos;admin affiche uniquement les donnees reelles. Si tout est a zero, verifiez les variables Vercel Supabase et les migrations de base.
        </div>
      ) : null}
      <AnalyticsCards
        revenue={snapshot.revenue}
        expenses={snapshot.expenses}
        grossProfit={snapshot.grossProfit}
        netProfit={snapshot.netProfit}
        visits={snapshot.visits}
        stock={snapshot.stock}
        averageBasket={snapshot.averageBasket}
        conversionRate={snapshot.conversionRate}
        traffic={snapshot.traffic}
      />
      <div className="grid gap-6 md:grid-cols-4">
        {[
          ["Produits actifs", String(products.length)],
          ["Categories", String(categories.length)],
          ["Villes couvertes", String(cities.length)],
          ["Top produit", snapshot.topProduct],
        ].map(([label, value]) => (
          <div key={label} className="surface p-6">
            <p className="text-sm text-stone">{label}</p>
            <p className="mt-3 font-serif text-3xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <p className="font-serif text-3xl">Commandes recentes</p>
          <div className="mt-5 space-y-4">
            {snapshot.orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b border-black/5 pb-4 text-sm">
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-stone">{order.user_email}</p>
                </div>
                <div className="text-right">
                  <p className="capitalize">{order.status}</p>
                  <p className="text-stone">{formatMAD(order.total)}</p>
                </div>
              </div>
            ))}
            {!snapshot.orders.length ? (
              <p className="text-sm text-stone">Aucune commande sur cette periode.</p>
            ) : null}
          </div>
        </div>
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <p className="font-serif text-3xl">Promotions actives</p>
            <p className="text-sm text-stone">Revenu total {formatMAD(snapshot.revenue)}</p>
          </div>
          <div className="mt-5 space-y-4">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="rounded-[1.5rem] border border-black/10 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{promotion.label}</p>
                  <p className="text-sm uppercase tracking-[0.25em] text-stone">{promotion.code}</p>
                </div>
                <p className="mt-2 text-sm text-stone">
                  {promotion.type === "percentage" ? `${promotion.value}%` : formatMAD(promotion.value)} de reduction
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
