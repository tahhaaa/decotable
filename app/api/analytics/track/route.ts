import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServiceRoleClient();

  if (!supabase) {
    return NextResponse.json({ ok: true });
  }

  await supabase.from("page_views").insert({
    path: body.path,
    referrer: body.referrer,
  });

  return NextResponse.json({ ok: true });
}
