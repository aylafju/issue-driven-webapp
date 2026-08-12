import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Ziel des OAuth-Redirects (Google), das in loginWithProvider
// als redirectTo an supabase.auth.signInWithOAuth() übergeben wird.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      redirect(next);
    }
  }

  redirect(
    `/login?error=${encodeURIComponent(
      "Die Anmeldung ist fehlgeschlagen. Bitte versuche es erneut.",
    )}`,
  );
}
