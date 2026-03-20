import { NextResponse } from "next/server";
import { createServerSupabaseClient, createServiceRoleClient } from "@/lib/supabase/server";

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function shouldTryFallback(message?: string | null) {
  if (!message) return false;

  return (
    message.includes("Invalid API key") ||
    message.includes("JWT") ||
    message.includes("No API key found") ||
    message.includes("not authenticated")
  );
}

type CartItemPayload = {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
};

type CityRow = {
  id: string;
  price: number;
  estimated_time: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionClient = createServerSupabaseClient();
    const serviceClient = createServiceRoleClient();
    const clients = [serviceClient, sessionClient].filter(
      (client): client is NonNullable<typeof serviceClient> | NonNullable<typeof sessionClient> => Boolean(client),
    );

    const {
      data: { user },
    } = sessionClient ? await sessionClient.auth.getUser() : { data: { user: null } };

    let createdOrderId: string | null = null;
    let shipping = 0;
    let eta = "24-48h";
    let warning: string | null = null;
    let lastError = "Configuration Supabase incomplete pour la commande.";

    if (!body.city) {
      return NextResponse.json({ ok: false, message: "Choisissez une ville de livraison." }, { status: 400 });
    }

    if (!clients.length) {
      return NextResponse.json({ ok: false, message: lastError }, { status: 500 });
    }

    for (const client of clients) {
      const { data: city, error: cityError } = await client
        .from("cities")
        .select("id,price,estimated_time")
        .eq("name", body.city)
        .maybeSingle<CityRow>();

      if (cityError) {
        lastError = `Erreur ville: ${cityError.message}`;
        if (shouldTryFallback(cityError.message) && client !== sessionClient) continue;
        return NextResponse.json({ ok: false, message: lastError }, { status: 400 });
      }

      if (!city) {
        return NextResponse.json({ ok: false, message: "Ville introuvable dans la base de livraison." }, { status: 400 });
      }

      const cart = Array.isArray(body.cart) ? (body.cart as CartItemPayload[]) : [];
      const subtotal = Number(body.subtotal || 0);
      shipping = Number(city.price || 0);
      eta = String(city.estimated_time || "24-48h");

      let orderPayload = {
        user_id: user?.id ?? null,
        email: body.email ? String(body.email) : null,
        phone: String(body.phone || ""),
        city_id: city.id,
        address: String(body.address || ""),
        subtotal,
        shipping,
        total: subtotal + shipping,
        status: "pending",
      };

      let { data: order, error: orderError } = await client
        .from("orders")
        .insert(orderPayload)
        .select("id")
        .single<{ id: string }>();

      if (
        orderError &&
        client === sessionClient &&
        /row-level security policy|policy/i.test(orderError.message)
      ) {
        orderPayload = {
          ...orderPayload,
          user_id: null,
        };

        ({ data: order, error: orderError } = await client
          .from("orders")
          .insert(orderPayload)
          .select("id")
          .single<{ id: string }>());
      }

      if (orderError) {
        lastError = `Erreur commande: ${orderError.message}`;
        if (shouldTryFallback(orderError.message) && client !== sessionClient) continue;
        return NextResponse.json({ ok: false, message: lastError }, { status: 400 });
      }

      createdOrderId = order?.id ?? null;

      if (order?.id && cart.length) {
        const itemsPayload = cart.map((item) => ({
          order_id: order.id,
          product_id: isUuid(item.productId) ? item.productId : null,
          product_name: item.productName || item.productId,
          quantity: Number(item.quantity || 0),
          unit_price: Number(item.unitPrice || 0),
        }));

        const { error: itemsError } = await client.from("order_items").insert(itemsPayload);
        if (itemsError) {
          warning =
            "Commande creee, mais les lignes produit n'ont pas pu etre enregistrees. Appliquez la migration finale Supabase.";
        }
      }

      break;
    }

    if (!createdOrderId) {
      return NextResponse.json({ ok: false, message: lastError }, { status: 500 });
    }

    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/push/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Nouvelle commande Decotable",
        body: `${body.fullName || body.phone} vient de passer une commande.`,
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
