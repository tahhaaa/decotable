"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function ImageUpload({
  inputName = "image",
  folder = "products",
}: {
  inputName?: string;
  folder?: string;
}) {
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

              if (!file) {
                setMessage("Choisissez une image d'abord.");
                return;
              }
              const payload = new FormData();
              payload.set("file", file);
              payload.set("folder", folder);
              const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: payload,
              });
              const result = await response.json();

              if (!response.ok || !result.ok) {
                setMessage(result.message || "Upload impossible.");
                return;
              }

              setUrl(result.url);
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
