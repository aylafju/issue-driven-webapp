import { loginWithProvider } from "./actions";

const PROVIDERS = [{ id: "google", label: "Google" }] as const;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-900/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-heading"
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl"
      >
        <h1 id="login-heading" className="text-2xl font-semibold text-neutral-900">
          Anmelden
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Wähle einen Anbieter, um dich anzumelden.
        </p>
        {params.error && (
          <p className="mt-4 text-sm text-red-600">{params.error}</p>
        )}
        <div className="mt-6 flex flex-col gap-3">
          {PROVIDERS.map((provider) => (
            <form key={provider.id} action={loginWithProvider}>
              <input type="hidden" name="provider" value={provider.id} />
              <button
                type="submit"
                className="w-full rounded border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
              >
                Mit {provider.label} anmelden
              </button>
            </form>
          ))}
        </div>
      </div>
    </main>
  );
}
