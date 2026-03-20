import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, message: "Supabase service role manquant." }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") || "uploads");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, message: "Aucun fichier recu." }, { status: 400 });
  }

  const extension = file.name.split(".").pop() || "png";
  const path = `${folder}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from("product-images").upload(path, buffer, {
    contentType: file.type,
    upsert: true,
  });

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
