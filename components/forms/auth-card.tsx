"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthCard({ mode }: { mode: "login" | "register" | "reset" }) {
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function submit(formData: FormData) {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const supabase = createClient();

    if (!supabase) {
      setMessage("Configurez Supabase pour activer l'authentification.");
      return;
    }

    if (mode === "register") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      setMessage(error?.message ?? "Compte cree. Verifiez votre email.");
      return;
    }

    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setMessage(error?.message ?? "Email de reinitialisation envoye.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).maybeSingle();
      const destination = profile?.role === "admin" ? "/admin" : "/dashboard";
      router.push(destination);
      router.refresh();
      return;
    }

    setMessage("Connexion reussie.");
  }

  const title = {
    login: "Connexion",
    register: "Creer un compte",
    reset: "Mot de passe oublie",
  }[mode];

  return (
    <form action={submit} className="surface mx-auto grid max-w-md gap-4 p-6">
      <p className="font-serif text-4xl">{title}</p>
      <Input name="email" type="email" placeholder="Email" required />
      {mode !== "reset" ? <Input name="password" type="password" placeholder="Mot de passe" required /> : null}
      <Button type="submit">{title}</Button>
      {mode === "login" ? (
        <div className="flex justify-between text-sm text-stone">
          <Link href="/register">Creer un compte</Link>
          <Link href="/reset-password">Mot de passe oublie ?</Link>
        </div>
      ) : null}
      {message ? <p className="text-sm text-stone">{message}</p> : null}
    </form>
  );
}
