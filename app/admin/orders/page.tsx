import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { deleteOrderAction, updateOrderStatusAction } from "@/lib/actions/admin";
import { getDashboardSnapshot } from "@/lib/data/store";
import { formatMAD, toWhatsAppLink } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const snapshot = await getDashboardSnapshot({}, { fallbackToMock: false });

  return (
    <AdminShell currentPath="/admin/orders">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Commandes</p>
          <h1 className="section-title">Suivi et changements de statut</h1>
        </div>
        <div className="grid gap-4">
          {snapshot.orders.map((order) => (
            <div key={order.id} className="surface grid gap-4 p-6 md:grid-cols-[1.2fr_1fr_180px_160px_160px_140px] md:items-center">
              <form action={updateOrderStatusAction} className="contents">
              <input type="hidden" name="id" value={order.id} />
              <div>
                <p className="font-medium">{order.id}</p>
                <p className="text-sm text-stone">
                  {order.user_email} · {order.city}
                </p>
                {order.phone ? <p className="text-sm text-stone">{order.phone}</p> : null}
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
              {toWhatsAppLink(
                order.phone,
                `Bonjour 🌿✨ Votre commande Decotable est bien recuee. ${order.productSummary ? `Produit: ${order.productSummary}. ` : ""}Merci beaucoup 💛 Nous confirmons votre commande et revenons vers vous tres vite 📦`,
              ) ? (
                <a
                  href={toWhatsAppLink(
                    order.phone,
                    `Bonjour 🌿✨ Votre commande Decotable est bien recuee. ${order.productSummary ? `Produit: ${order.productSummary}. ` : ""}Merci beaucoup 💛 Nous confirmons votre commande et revenons vers vous tres vite 📦`,
                  ) || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-black/10 px-5 text-sm font-medium transition hover:bg-black hover:text-white"
                >
                  WhatsApp
                </a>
              ) : (
                <p className="text-sm text-stone">Sans numero</p>
              )}
              <form action={deleteOrderAction}>
                <input type="hidden" name="id" value={order.id} />
                <Button type="submit" variant="ghost">
                  Supprimer
                </Button>
              </form>
            </div>
          ))}
          {!snapshot.orders.length ? (
            <div className="surface p-8 text-sm text-stone">
              Aucune commande sur la periode selectionnee.
            </div>
          ) : null}
        </div>
      </div>
    </AdminShell>
  );
}
