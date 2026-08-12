"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Provider } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/lib/supabase/errors";

// Anbieter, die auf der Login-Seite zur Auswahl stehen (siehe page.tsx).
const ALLOWED_PROVIDERS = ["google"] as const;

function isAllowedProvider(value: string): value is Provider {
  return (ALLOWED_PROVIDERS as readonly string[]).includes(value);
}

export async function loginWithProvider(formData: FormData) {
  const provider = String(formData.get("provider") ?? "");

  if (!isAllowedProvider(provider)) {
    redirect(`/login?error=${encodeURIComponent("Unbekannter Anmeldedienst.")}`);
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data.url) {
    redirect(
      `/login?error=${encodeURIComponent(mapAuthError(error?.message ?? ""))}`,
    );
  }

  redirect(data.url);
}
