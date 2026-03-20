import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/lib/actions/admin";
import { getDashboardSnapshot } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <AdminShell currentPath="/admin/orders">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Commandes</p>
          <h1 className="section-title">Suivi et changements de statut</h1>
        </div>
        <div className="grid gap-4">
          {snapshot.orders.map((order) => (
            <form key={order.id} action={updateOrderStatusAction} className="surface grid gap-4 p-6 md:grid-cols-[1.2fr_1fr_180px_160px] md:items-center">
              <input type="hidden" name="id" value={order.id} />
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-stone">
                  {order.user_email} · {order.city}
                </p>
              </div>
              <p>{formatMAD(order.total)}</p>
              <select name="status" defaultValue={order.status} className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm">
                {["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled"].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Button type="submit">Enregistrer</Button>
            </form>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
