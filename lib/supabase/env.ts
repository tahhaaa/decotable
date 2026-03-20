import { z } from "zod";

function cleanEnvValue(value: string | undefined) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: z.string().optional(),
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: z.string().optional(),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: z.string().optional(),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: z.string().optional(),
});

const serverSchema = clientSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  VAPID_PRIVATE_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY),
  NEXT_PUBLIC_SITE_URL: cleanEnvValue(process.env.NEXT_PUBLIC_SITE_URL),
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: cleanEnvValue(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY),
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: cleanEnvValue(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: cleanEnvValue(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: cleanEnvValue(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
});

export const serverEnv = serverSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    cleanEnvValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY),
  NEXT_PUBLIC_SITE_URL: cleanEnvValue(process.env.NEXT_PUBLIC_SITE_URL),
  NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: cleanEnvValue(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY),
  NEXT_PUBLIC_EMAILJS_SERVICE_ID: cleanEnvValue(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID),
  NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: cleanEnvValue(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY: cleanEnvValue(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
  SUPABASE_SERVICE_ROLE_KEY: cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY),
  VAPID_PRIVATE_KEY: cleanEnvValue(process.env.VAPID_PRIVATE_KEY),
  EMAIL_FROM: cleanEnvValue(process.env.EMAIL_FROM),
});

export function isSupabaseConfigured() {
  return Boolean(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL &&
      (clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY),
  );
}
