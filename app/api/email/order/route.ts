import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { clientEnv } from "@/lib/supabase/env";

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = createServiceRoleClient();
  let createdOrderId: string | null = null;
  let shipping = 0;
  let eta = "24-48h";

  if (supabase && body.city) {
    const { data: city } = await supabase.from("cities").select("id,price,estimated_time").eq("name", body.city).maybeSingle();
    const cart = Array.isArray(body.cart) ? body.cart : [];
    const subtotal = Number(body.subtotal || 0);
    shipping = Number(city?.price || 0);
    eta = String(city?.estimated_time || "24-48h");

    const { data: order } = await supabase
      .from("orders")
      .insert({
        email: body.email,
        phone: body.phone,
        city_id: city?.id ?? null,
        address: body.address,
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: "pending",
      })
      .select("id")
      .single();

    createdOrderId = order?.id ?? null;

    if (order?.id && cart.length) {
      await supabase.from("order_items").insert(
        cart.map((item: { productId: string; productName?: string; quantity: number; unitPrice?: number }) => ({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName || item.productId,
          quantity: item.quantity,
          unit_price: Number(item.unitPrice || 0),
        })),
      );
    }
  }

  if (
    !clientEnv.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ||
    !clientEnv.NEXT_PUBLIC_EMAILJS_SERVICE_ID ||
    !clientEnv.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
  ) {
    return NextResponse.json(
      {
        ok: true,
        orderId: createdOrderId,
        status: "pending",
        eta,
        shipping,
      },
      { status: 200 },
    );
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

  if (supabase) {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/push/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Nouvelle commande Decotable",
        body: `${body.fullName || body.email} vient de passer une commande.`,
        url: "/admin/orders",
      }),
    }).catch(() => undefined);
  }

  return NextResponse.json({
    ok: response.ok,
    orderId: createdOrderId,
    status: "pending",
    eta,
    shipping,
  });
}
