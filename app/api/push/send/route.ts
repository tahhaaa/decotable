import { NextResponse } from "next/server";
import { sendPushNotification } from "@/lib/push";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await sendPushNotification(body);

  if (!result.ok) {
    return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
  }

  return NextResponse.json(result);
}
