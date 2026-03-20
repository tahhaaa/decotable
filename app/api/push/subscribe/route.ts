import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const sessionClient = createServerSupabaseClient();
  const serviceClient = createServiceRoleClient();
  const {
    data: { user },
  } = sessionClient ? await sessionClient.auth.getUser() : { data: { user: null } };

  const clients = [
    user && sessionClient
      ? {
          client: sessionClient,
          values: {
            endpoint: payload.endpoint,
            subscription: payload,
            user_id: user.id,
          },
        }
      : null,
    serviceClient
      ? {
          client: serviceClient,
          values: {
            endpoint: payload.endpoint,
            subscription: payload,
            user_id: user?.id ?? null,
          },
        }
      : null,
  ].filter(Boolean) as {
    client: NonNullable<typeof sessionClient> | NonNullable<typeof serviceClient>;
    values: {
      endpoint: string;
      subscription: unknown;
      user_id: string | null;
    };
  }[];

  if (!clients.length) {
    return NextResponse.json(
      { ok: false, message: "Connectez-vous puis verifiez vos cles Supabase/Vercel." },
      { status: 400 },
    );
  }

  let lastError = "Impossible d'enregistrer l'abonnement push.";

  for (const entry of clients) {
    const { error } = await entry.client.from("push_subscriptions").upsert(entry.values);
    if (!error) {
      return NextResponse.json({ ok: true });
    }
    lastError = error.message;
  }

  return NextResponse.json({ ok: false, message: lastError }, { status: 400 });
}
