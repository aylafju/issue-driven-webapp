import Link from "next/link";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-50 px-4 text-neutral-900">
      <h1 className="text-2xl font-semibold">Anmelden</h1>
      <form action={login} className="flex w-full max-w-sm flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          E-Mail
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="rounded border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Passwort
          <input
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="current-password"
            className="rounded border border-neutral-300 px-3 py-2"
          />
        </label>
        {params.message && (
          <p className="text-sm text-neutral-600">{params.message}</p>
        )}
        {params.error && (
          <p className="text-sm text-red-600">{params.error}</p>
        )}
        <button
          type="submit"
          className="rounded bg-neutral-900 px-4 py-2 text-white"
        >
          Anmelden
        </button>
      </form>
      <p className="text-sm text-neutral-500">
        Noch kein Konto?{" "}
        <Link href="/signup" className="underline">
          Registrieren
        </Link>
      </p>
    </main>
  );
}
