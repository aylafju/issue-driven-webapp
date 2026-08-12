import Link from "next/link";
import { redirect } from "next/navigation";
import { VersionFooter } from "@/components/VersionFooter";
import { createClient } from "@/lib/supabase/server";

// Öffentliche Startseite. Angemeldete User werden direkt zur geschützten
// App-View weitergeleitet (siehe src/app/app/page.tsx).
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/app");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-neutral-50 text-neutral-900">
      <h1 className="text-3xl font-semibold">🚧 Im Aufbau</h1>
      <p className="text-neutral-500">
        Diese App wird issue-getrieben entwickelt – Features entstehen aus
        GitHub-Issues.
      </p>
      <div className="mt-4 flex gap-4 text-sm">
        <Link href="/login" className="underline">
          Anmelden
        </Link>
      </div>
      <VersionFooter />
    </main>
  );
}
