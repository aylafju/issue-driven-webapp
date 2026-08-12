import { redirect } from "next/navigation";
import { VersionFooter } from "@/components/VersionFooter";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../auth/actions";

// Geschützte App-View – nur für angemeldete User erreichbar. Nicht
// angemeldete User werden zur Login-Seite weitergeleitet.
export default async function AppView() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-neutral-50 text-neutral-900">
      <h1 className="text-3xl font-semibold">App</h1>
      <p className="text-neutral-700">Angemeldet als {user.email}</p>
      <form action={logout}>
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-sm text-white"
        >
          Abmelden
        </button>
      </form>
      <VersionFooter />
    </main>
  );
}
