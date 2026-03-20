"use client";

import { createBrowserClient } from "@supabase/ssr";
import { clientEnv } from "@/lib/supabase/env";

export function createClient() {
  const publicKey =
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!clientEnv.NEXT_PUBLIC_SUPABASE_URL || !publicKey) {
    return null;
  }

  return createBrowserClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicKey,
  );
}
