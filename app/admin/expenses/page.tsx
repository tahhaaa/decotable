import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteExpenseAction, upsertExpenseAction } from "@/lib/actions/admin";
import { getExpenses } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

export default async function AdminExpensesPage() {
  const expenses = await getExpenses();

  return (
    <AdminShell currentPath="/admin/expenses">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Comptabilite</p>
          <h1 className="section-title">Charges et frais</h1>
        </div>
        <form action={upsertExpenseAction} className="surface grid gap-4 p-6 md:grid-cols-2">
          <Input name="label" placeholder="Libelle" required />
          <Input name="amount" type="number" placeholder="Montant MAD" required />
          <Input name="expenseDate" type="date" required />
          <Input name="notes" placeholder="Notes" />
          <Button type="submit" className="md:col-span-2 md:w-fit">
            Ajouter une charge
          </Button>
        </form>
        <div className="surface overflow-hidden">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-black/[0.03] text-stone">
              <tr>
                <th className="px-6 py-4">Libelle</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Montant</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-t border-black/5">
                  <td className="px-6 py-4">{expense.label}</td>
                  <td className="px-6 py-4">{expense.expenseDate}</td>
                  <td className="px-6 py-4">{formatMAD(expense.amount)}</td>
                  <td className="px-6 py-4">
                    <form action={deleteExpenseAction}>
                      <input type="hidden" name="id" value={expense.id} />
                      <Button type="submit" variant="ghost">
                        Supprimer
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
              {!expenses.length ? (
                <tr>
                  <td className="px-6 py-8 text-stone" colSpan={4}>
                    Aucune charge enregistree.
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
