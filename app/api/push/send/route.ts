import { NextResponse } from "next/server";
import webpush from "web-push";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { clientEnv, serverEnv } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServiceRoleClient();

  if (
    !supabase ||
    !clientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    !serverEnv.VAPID_PRIVATE_KEY
  ) {
    return NextResponse.json({ ok: false, message: "Configuration push incomplete." }, { status: 400 });
  }

  webpush.setVapidDetails(
    `mailto:${serverEnv.EMAIL_FROM || "contact@decotable.ma"}`,
    clientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    serverEnv.VAPID_PRIVATE_KEY,
  );

  const { data, error } = await supabase.from("push_subscriptions").select("subscription");
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }

  await Promise.all(
    (data || []).map((entry) =>
      webpush.sendNotification(entry.subscription, JSON.stringify(body)).catch(() => undefined),
    ),
  );

  return NextResponse.json({ ok: true });
}
