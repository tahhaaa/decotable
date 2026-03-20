"use client";

import { useEffect } from "react";

export function TrafficTracker() {
  useEffect(() => {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || null,
      }),
    }).catch(() => undefined);
  }, []);

  return null;
}
