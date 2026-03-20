"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type PushSupportState = {
  supported: boolean;
  message: string;
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function detectPushSupport(): PushSupportState {
  if (typeof window === "undefined") {
    return {
      supported: false,
      message: "Verification du navigateur en cours.",
    };
  }

  if (!window.isSecureContext) {
    return {
      supported: false,
      message: "Les notifications push exigent HTTPS. Sur telephone, ouvrez le site securise puis installez-le si besoin.",
    };
  }

  if (!("Notification" in window)) {
    return {
      supported: false,
      message: "Ce navigateur ne gere pas les notifications web.",
    };
  }

  if (!("serviceWorker" in navigator)) {
    return {
      supported: false,
      message: "Ce navigateur ne prend pas en charge les service workers necessaires aux notifications.",
    };
  }

  if (!("PushManager" in window)) {
    return {
      supported: false,
      message: "Push non disponible ici. Sur iPhone, utilisez Safari et installez l'application sur l'ecran d'accueil.",
    };
  }

  if (Notification.permission === "denied") {
    return {
      supported: false,
      message: "Les notifications sont bloquees dans le navigateur. Reautorisez-les dans les reglages puis rechargez la page.",
    };
  }

  return {
    supported: true,
    message: "Activez les notifications pour recevoir les nouvelles commandes et changements de statut.",
  };
}

export function PushOptIn() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [support, setSupport] = useState<PushSupportState>({
    supported: false,
    message: "Verification du navigateur en cours.",
  });

  useEffect(() => {
    setSupport(detectPushSupport());
  }, []);

  const helperMessage = useMemo(() => message || support.message, [message, support.message]);

  async function subscribe() {
    const nextSupport = detectPushSupport();
    setSupport(nextSupport);

    if (!nextSupport.supported) {
      setMessage(nextSupport.message);
      return;
    }

    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setMessage("Ajoutez NEXT_PUBLIC_VAPID_PUBLIC_KEY sur Vercel pour activer les notifications.");
      return;
    }

    try {
      setIsSubmitting(true);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setMessage("Autorisation refusee. Activez les notifications dans le navigateur puis reessayez.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        setMessage("Abonnement enregistre localement, mais l'API push a refuse la sauvegarde. Verifiez Vercel et Supabase.");
        return;
      }

      setMessage("Notifications activees avec succes.");
    } catch {
      setMessage("Impossible d'activer les notifications sur ce navigateur pour l'instant.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="surface flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">Recevoir les notifications Decotable</p>
        <p className="text-sm text-stone">Nouvelles commandes, changements de statut et promotions en temps reel.</p>
      </div>
      <div className="flex flex-col items-start gap-2">
        <Button onClick={subscribe} disabled={isSubmitting}>
          {isSubmitting ? "Activation..." : "Activer"}
        </Button>
        <p className="max-w-md text-sm text-stone">{helperMessage}</p>
      </div>
    </div>
  );
}
