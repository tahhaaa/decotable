import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { clientEnv } from "@/lib/supabase/env";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServiceRoleClient();
    let createdOrderId: string | null = `DC-${randomUUID().slice(0, 8).toUpperCase()}`;
    let shipping = 0;
    let eta = "24-48h";
    let warning: string | null = null;

    if (supabase && body.city) {
      const { data: city, error: cityError } = await supabase
        .from("cities")
        .select("id,price,estimated_time")
        .eq("name", body.city)
        .maybeSingle();

      if (cityError) {
        warning = `Ville non reliee a la base: ${cityError.message}`;
      }

      const cart = Array.isArray(body.cart) ? body.cart : [];
      const subtotal = Number(body.subtotal || 0);
      shipping = Number(city?.price || 0);
      eta = String(city?.estimated_time || "24-48h");

      const { data: order, error: orderError } = await supabase
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

      if (orderError) {
        warning = `Commande non enregistree en base: ${orderError.message}`;
      } else {
        createdOrderId = order?.id ?? createdOrderId;
      }

      if (!orderError && order?.id && cart.length) {
        const itemsPayload = cart.map(
          (item: { productId: string; productName?: string; quantity: number; unitPrice?: number }) => ({
            order_id: order.id,
            product_id: isUuid(item.productId) ? item.productId : null,
            product_name: item.productName || item.productId,
            quantity: item.quantity,
            unit_price: Number(item.unitPrice || 0),
          }),
        );

        const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
        if (itemsError) {
          warning = `Lignes commande non enregistrees: ${itemsError.message}`;
        }
      }
    }

    if (
      clientEnv.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY &&
      clientEnv.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
      clientEnv.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    ) {
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

      if (!response.ok) {
        warning = warning
          ? `${warning} Email non envoye.`
          : "Commande creee, mais l'email de confirmation n'a pas pu etre envoye.";
      }
    }

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
      ok: true,
      orderId: createdOrderId,
      status: "pending",
      eta,
      shipping,
      warning,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Erreur serveur inconnue pendant la commande.",
      },
      { status: 500 },
    );
  }
}
