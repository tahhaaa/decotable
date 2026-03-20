import webpush from "web-push";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { clientEnv, serverEnv } from "@/lib/supabase/env";

type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendPushNotification(payload: PushPayload) {
  const supabase = createServiceRoleClient();

  if (!supabase || !clientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !serverEnv.VAPID_PRIVATE_KEY) {
    return { ok: false as const, message: "Configuration push incomplete." };
  }

  webpush.setVapidDetails(
    `mailto:${serverEnv.EMAIL_FROM || "chahbounni2009@gmail.com"}`,
    clientEnv.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    serverEnv.VAPID_PRIVATE_KEY,
  );

  const { data, error } = await supabase.from("push_subscriptions").select("endpoint,subscription");
  if (error) {
    return { ok: false as const, message: error.message };
  }

  const results = await Promise.all(
    (data || []).map(async (entry) => {
      try {
        await webpush.sendNotification(entry.subscription, JSON.stringify(payload));
        return { ok: true as const, endpoint: entry.endpoint };
      } catch {
        return { ok: false as const, endpoint: entry.endpoint };
      }
    }),
  );

  const sent = results.filter((item) => item.ok).length;
  return { ok: true as const, sent, total: results.length };
}
