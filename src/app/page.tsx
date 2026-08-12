import Link from "next/link";
import { VersionFooter } from "@/components/VersionFooter";
import { createClient } from "@/lib/supabase/server";
import { logout } from "./auth/actions";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-neutral-50 text-neutral-900">
      <h1 className="text-3xl font-semibold">🚧 Im Aufbau</h1>
      <p className="text-neutral-500">
        Diese App wird issue-getrieben entwickelt – Features entstehen aus
        GitHub-Issues.
      </p>
      {user ? (
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-neutral-700">Angemeldet als {user.email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="rounded bg-neutral-900 px-4 py-2 text-sm text-white"
            >
              Abmelden
            </button>
          </form>
        </div>
      ) : (
        <div className="mt-4 flex gap-4 text-sm">
          <Link href="/login" className="underline">
            Anmelden
          </Link>
          <Link href="/signup" className="underline">
            Registrieren
          </Link>
        </div>
      )}
      <VersionFooter />
    </main>
  );
}
