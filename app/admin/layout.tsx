import Link from "next/link";
import { getCurrentUserRole } from "@/lib/supabase/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await getCurrentUserRole();

  if (access.configured && access.role !== "admin") {
    return (
      <div className="container-shell flex min-h-[60vh] items-center justify-center py-16">
        <div className="surface max-w-xl space-y-4 p-10 text-center">
          <p className="font-serif text-4xl">Acces reserve a l&apos;administration</p>
          <p className="text-sm leading-7 text-stone">
            Connectez-vous avec un compte admin Supabase pour gerer les produits, commandes et parametres de livraison.
          </p>
          <Link href="/login" className="inline-flex rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
