import { TrafficPoint } from "@/lib/types";
import { formatMAD } from "@/lib/utils";

export function AnalyticsCards({
  revenue,
  expenses,
  grossProfit,
  netProfit,
  visits,
  stock,
  averageBasket,
  conversionRate,
  traffic,
}: {
  revenue: number;
  expenses: number;
  grossProfit: number;
  netProfit: number;
  visits: number;
  stock: number;
  averageBasket: number;
  conversionRate: number;
  traffic: TrafficPoint[];
}) {
  const maxVisits = Math.max(...traffic.map((point) => point.visits), 1);
  const maxOrders = Math.max(...traffic.map((point) => point.orders), 1);
  const maxRevenue = Math.max(...traffic.map((point) => point.revenue), 1);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Revenu", formatMAD(revenue)],
          ["Charges", formatMAD(expenses)],
          ["Marge brute", formatMAD(grossProfit)],
          ["Resultat net", formatMAD(netProfit)],
          ["Trafic 7 jours", `${visits} visites`],
          ["Stock total", `${stock} pieces`],
          ["Panier moyen", formatMAD(averageBasket)],
        ].map(([label, value]) => (
          <div key={label} className="surface p-6">
            <p className="text-sm text-stone">{label}</p>
            <p className="mt-3 font-serif text-3xl sm:text-4xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface p-6">
          <div className="flex items-center justify-between">
            <p className="font-serif text-3xl">Trafic & commandes</p>
            <p className="text-sm text-stone">Conversion {conversionRate}%</p>
          </div>
          <div className="mt-8 grid h-56 grid-cols-7 items-end gap-2 sm:h-64 sm:gap-4">
            {traffic.map((point) => (
              <div key={point.day} className="flex h-full flex-col items-center justify-end gap-3">
                <div className="flex h-full w-full items-end gap-2">
                  <div className="w-full rounded-t-2xl bg-beige" style={{ height: `${(point.visits / maxVisits) * 100}%` }} />
                  <div className="w-full rounded-t-2xl bg-ink" style={{ height: `${(point.orders / maxOrders) * 100}%` }} />
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-stone">{point.day}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="surface p-6">
          <p className="font-serif text-3xl">Argent genere</p>
          <div className="mt-5 space-y-4">
            {traffic.map((point) => (
              <div key={point.day}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>{point.day}</span>
                  <span className="text-stone">{formatMAD(point.revenue)}</span>
                </div>
                <div className="h-3 rounded-full bg-black/5">
                  <div className="h-3 rounded-full bg-gradient-to-r from-beige to-ink" style={{ width: `${(point.revenue / maxRevenue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
