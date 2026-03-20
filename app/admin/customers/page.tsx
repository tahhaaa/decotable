import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminCustomersPage() {
  return (
    <AdminShell currentPath="/admin/customers">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-stone">Clients</p>
          <h1 className="section-title">Gestion des utilisateurs</h1>
        </div>
        <div className="surface p-6 text-sm leading-7 text-stone">
          Les profils utilisateurs et les roles sont geres via Supabase Auth et la table <code>profiles</code>. Une fois les cles configurees, cette section peut afficher la liste temps reel des clients, leurs commandes et leurs listes d&apos;envies.
        </div>
      </div>
    </AdminShell>
  );
}
