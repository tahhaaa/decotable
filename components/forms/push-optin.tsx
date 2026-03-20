"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function PushOptIn() {
  const [message, setMessage] = useState("");

  async function subscribe() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setMessage("Les notifications push ne sont pas supportees sur ce navigateur.");
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setMessage("Ajoutez votre cle publique VAPID pour activer les notifications.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    setMessage("Notifications activees.");
  }

  return (
    <div className="surface flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">Recevoir les notifications Decotable</p>
        <p className="text-sm text-stone">Commandes, changements de statut et promotions exclusives.</p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <Button onClick={subscribe}>Activer</Button>
        {message ? <p className="text-sm text-stone">{message}</p> : null}
      </div>
    </div>
  );
}
