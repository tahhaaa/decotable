"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing } from "lucide-react";
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
      message: "Les notifications push exigent HTTPS. Ouvrez le site securise puis installez-le si besoin.",
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
      message: "Les notifications sont bloquees. Reautorisez-les dans les reglages puis rechargez la page.",
    };
  }

  return {
    supported: true,
    message: "Activez les notifications pour recevoir les nouvelles commandes et changements de statut.",
  };
}

async function readJsonSafely(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function PushOptIn() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
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

      const result = await readJsonSafely(response);
      if (!response.ok) {
        setMessage(result?.message || "L'abonnement push n'a pas pu etre enregistre.");
        return;
      }

      setIsActivated(true);
      setMessage("Notifications activees avec succes. Vous pouvez maintenant envoyer un test.");
    } catch {
      setMessage("Impossible d'activer les notifications sur ce navigateur pour l'instant.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function sendTest() {
    try {
      setIsTesting(true);
      const response = await fetch("/api/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Test notification Decotable",
          body: "Votre configuration push fonctionne correctement.",
          url: "/admin",
        }),
      });
      const result = await readJsonSafely(response);
      if (!response.ok) {
        setMessage(result?.message || "Le test push a echoue.");
        return;
      }
      setMessage("Notification de test envoyee.");
    } catch {
      setMessage("Impossible d'envoyer la notification de test.");
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <div className="surface fade-soft flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-beige/15 text-ink">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Recevoir les notifications Decotable</p>
              <p className="text-sm text-stone">Nouvelles commandes, changements de statut et promotions en temps reel.</p>
            </div>
          </div>
          <p className="max-w-xl text-sm text-stone">{helperMessage}</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
          <Button onClick={subscribe} disabled={isSubmitting}>
            {isSubmitting ? "Activation..." : isActivated ? "Reconfigurer" : "Activer"}
          </Button>
          <Button onClick={sendTest} variant="ghost" disabled={!support.supported || isTesting}>
            {isTesting ? "Envoi..." : "Envoyer un test"}
          </Button>
        </div>
      </div>
    </div>
  );
}
