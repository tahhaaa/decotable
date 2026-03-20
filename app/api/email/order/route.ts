import { NextResponse } from "next/server";
import { clientEnv } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const body = await request.json();

  if (
    !clientEnv.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
    !clientEnv.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
    !clientEnv.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  ) {
    return NextResponse.json({ ok: false, message: "Configuration EmailJS manquante." }, { status: 400 });
  }

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: clientEnv.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: clientEnv.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      user_id: clientEnv.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      template_params: body,
    }),
  });

  return NextResponse.json({ ok: response.ok });
}
