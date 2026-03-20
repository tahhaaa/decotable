"use server";

import { revalidatePath } from "next/cache";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUserRole } from "@/lib/supabase/auth";
import { slugify } from "@/lib/utils";

async function getAdminClient() {
  const access = await getCurrentUserRole();
  if (access.role === "admin") {
    return createServerSupabaseClient();
  }

  return createServiceRoleClient();
}

export async function upsertCategoryAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const name = String(formData.get("name") || "");
  const description = String(formData.get("description") || "");
  const image = String(formData.get("image") || "");

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description,
    image_url: image,
  });

  if (error) return;
  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function upsertProductAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const name = String(formData.get("name") || "");
  const description = String(formData.get("description") || "");
  const shortDescription = String(formData.get("shortDescription") || "");
  const image = String(formData.get("image") || "");
  const categoryId = String(formData.get("categoryId") || "");
  const price = Number(formData.get("price") || 0);
  const purchasePrice = Number(formData.get("purchasePrice") || 0);
  const inventory = Number(formData.get("inventory") || 0);

  const { error } = await supabase.from("products").insert({
    name,
    slug: slugify(name),
    description,
    short_description: shortDescription,
    category_id: categoryId,
    price,
    purchase_price: purchasePrice,
    inventory,
    images: [image],
  });

  if (error) return;
  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return;
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  const { data: subscriptions } = await supabase.from("push_subscriptions").select("subscription");
  if (subscriptions?.length) {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/push/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Commande mise a jour",
        body: `La commande ${id} est maintenant ${status}.`,
        url: "/admin/orders",
      }),
    }).catch(() => undefined);
  }
}

export async function updateCityAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const price = Number(formData.get("price") || 0);
  const eta = String(formData.get("eta") || "");

  const { error } = await supabase.from("cities").update({ price, estimated_time: eta }).eq("id", id);
  if (error) return;
  revalidatePath("/admin");
  revalidatePath("/checkout");
}

export async function applyDefaultCityPricingAction(): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const { data: cities } = await supabase.from("cities").select("id,name");
  if (!cities?.length) return;

  for (const city of cities) {
    const price = city.name.toLowerCase() === "rabat" ? 20 : 30;
    await supabase.from("cities").update({ price }).eq("id", city.id);
  }

  revalidatePath("/admin/cities");
  revalidatePath("/checkout");
}

export async function upsertPromotionAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const code = String(formData.get("code") || "");
  const label = String(formData.get("label") || "");
  const type = String(formData.get("type") || "percentage");
  const value = Number(formData.get("value") || 0);

  const { error } = await supabase.from("promotions").insert({
    code,
    label,
    type,
    value,
    active: true,
  });

  if (error) return;
  revalidatePath("/admin");
  revalidatePath("/checkout");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return;
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return;
  revalidatePath("/admin/categories");
  revalidatePath("/shop");
}

export async function deletePromotionAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("promotions").delete().eq("id", id);
  if (error) return;
  revalidatePath("/admin/promotions");
  revalidatePath("/checkout");
}

export async function deleteOrderAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  await supabase.from("order_items").delete().eq("order_id", id);
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return;
  revalidatePath("/admin/orders");
  revalidatePath("/dashboard");
}

export async function resetSiteDataAction(): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  await supabase.from("order_items").delete().neq("id", "");
  await supabase.from("orders").delete().neq("id", "");
  await supabase.from("reviews").delete().neq("id", "");
  await supabase.from("wishlist").delete().neq("id", "");
  await supabase.from("carts").delete().neq("user_id", "");
  await supabase.from("page_views").delete().neq("id", "");
  await supabase.from("expenses").delete().neq("id", "");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

export async function upsertExpenseAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const label = String(formData.get("label") || "");
  const amount = Number(formData.get("amount") || 0);
  const expenseDate = String(formData.get("expenseDate") || "");
  const notes = String(formData.get("notes") || "");

  const { error } = await supabase.from("expenses").insert({
    label,
    amount,
    expense_date: expenseDate,
    notes,
  });

  if (error) return;
  revalidatePath("/admin");
  revalidatePath("/admin/expenses");
}

export async function deleteExpenseAction(formData: FormData): Promise<void> {
  const supabase = await getAdminClient();
  if (!supabase) return;

  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) return;
  revalidatePath("/admin");
  revalidatePath("/admin/expenses");
}
