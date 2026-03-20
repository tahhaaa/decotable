"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function ImageUpload({ inputName = "image" }: { inputName?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-black/[0.02] p-4 md:col-span-2">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" />
      <input
        name={inputName}
        value={url}
        readOnly
        placeholder="URL image principale"
        className="mb-3 h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm"
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="ghost" onClick={() => fileRef.current?.click()}>
          Choisir une image
        </Button>
        <Button
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              const file = fileRef.current?.files?.[0];
              const supabase = createClient();

              if (!file) {
                setMessage("Choisissez une image d'abord.");
                return;
              }

              if (!supabase) {
                setMessage("Supabase n'est pas configure.");
                return;
              }

              const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
              const { error } = await supabase.storage.from("product-images").upload(fileName, file, {
                cacheControl: "3600",
                upsert: true,
              });

              if (error) {
                setMessage(error.message);
                return;
              }

              const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
              setUrl(data.publicUrl);
              setMessage("Image uploadee avec succes.");
            })
          }
        >
          {isPending ? "Upload..." : "Uploader"}
        </Button>
        {message ? <p className="text-sm text-stone">{message}</p> : null}
      </div>
    </div>
  );
}
