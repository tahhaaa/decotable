import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const payload = await request.json();
  const supabase = createServiceRoleClient();

  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase service role manquant." }, { status: 400 });
  }

  const { error } = await supabase.from("push_subscriptions").upsert({
    endpoint: payload.endpoint,
    subscription: payload,
  });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
