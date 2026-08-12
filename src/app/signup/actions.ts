"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/lib/supabase/errors";

export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const origin = (await headers()).get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(mapAuthError(error.message))}`);
  }

  // Ist die E-Mail-Bestätigung im Supabase-Projekt deaktiviert, liefert
  // signUp() direkt eine Session zurück und der User ist schon angemeldet.
  if (data.session) {
    redirect("/");
  }

  redirect(
    `/login?message=${encodeURIComponent(
      "Konto erstellt – bitte bestätige deine E-Mail-Adresse über den Link, den wir dir geschickt haben.",
    )}`,
  );
}
