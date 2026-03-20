import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMAD(value: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function absoluteUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return new URL(path, base).toString();
}

export function getSafeImageSrc(src?: string | null, fallback = "/icons/icon-512.svg") {
  if (!src) return fallback;
  if (src.startsWith("/")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return fallback;
}

export function toWhatsAppLink(phone?: string | null, text?: string) {
  if (!phone) return null;

  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;

  let normalized = digits;
  if (digits.startsWith("0")) normalized = `212${digits.slice(1)}`;
  if (digits.startsWith("212")) normalized = digits;

  const message = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${normalized}${message}`;
}

export function shortOrderReference(value?: string | null) {
  if (!value) return "";
  const compact = value.replace(/-/g, "");
  return `#${compact.slice(-8).toUpperCase()}`;
}
