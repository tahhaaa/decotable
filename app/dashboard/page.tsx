import Link from "next/link";
import { PushOptIn } from "@/components/forms/push-optin";
import { getDashboardSnapshot } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="container-shell space-y-8 py-12">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Espace client</p>
          <h1 className="section-title">Votre tableau de bord</h1>
        </div>
        <Link href="/shop" className="text-sm text-stone underline-offset-4 hover:underline">
          Continuer mes achats
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {[
          ["Depense totale", formatMAD(snapshot.revenue)],
          ["Commandes", String(snapshot.monthlyOrders)],
          ["Clients actifs", String(snapshot.customers)],
          ["A preparer", String(snapshot.pendingOrders)],
        ].map(([label, value]) => (
          <div key={label} className="surface p-6">
            <p className="text-sm text-stone">{label}</p>
            <p className="mt-3 font-serif text-4xl">{value}</p>
          </div>
        ))}
      </div>
      <div className="surface overflow-hidden">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black/[0.03] text-stone">
            <tr>
              <th className="px-6 py-4">Commande</th>
              <th className="px-6 py-4">Ville</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {snapshot.orders.map((order) => (
              <tr key={order.id} className="border-t border-black/5">
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.city}</td>
                <td className="px-6 py-4 capitalize">{order.status}</td>
                <td className="px-6 py-4">{formatMAD(order.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PushOptIn />
    </div>
  );
}
