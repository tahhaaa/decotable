import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentUserRole() {
  const supabase = createServerSupabaseClient();
  if (!supabase) return { role: "admin" as const, user: null, configured: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { role: "user" as const, user: null, configured: true };

  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return {
    role: (data?.role as "user" | "admin" | undefined) || "user",
    user,
    configured: true,
  };
}
