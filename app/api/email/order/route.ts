import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServiceRoleClient();
    const sessionClient = createServerSupabaseClient();
    const {
      data: { user },
    } = sessionClient ? await sessionClient.auth.getUser() : { data: { user: null } };

    let createdOrderId: string | null = null;
    let shipping = 0;
    let eta = "24-48h";
    let warning: string | null = null;

    if (!supabase) {
      return NextResponse.json({ ok: false, message: "Supabase service role indisponible." }, { status: 500 });
    }

    if (body.city) {
      const { data: city, error: cityError } = await supabase
        .from("cities")
        .select("id,price,estimated_time")
        .eq("name", body.city)
        .maybeSingle();

      if (cityError) {
        return NextResponse.json({ ok: false, message: `Erreur ville: ${cityError.message}` }, { status: 400 });
      }

      const cart = Array.isArray(body.cart) ? body.cart : [];
      const subtotal = Number(body.subtotal || 0);
      shipping = Number(city?.price || 0);
      eta = String(city?.estimated_time || "24-48h");

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
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
        return NextResponse.json({ ok: false, message: `Erreur commande: ${orderError.message}` }, { status: 400 });
      }

      createdOrderId = order?.id ?? null;

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
          return NextResponse.json(
            { ok: false, message: `Erreur lignes commande: ${itemsError.message}` },
            { status: 400 },
          );
        }
      }
    }

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
