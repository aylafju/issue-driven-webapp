import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginWithProvider } from "./actions";

const PROVIDERS = [{ id: "google", label: "Google" }] as const;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-heading"
        className="w-full max-w-sm"
      >
        <CardHeader>
          <CardTitle id="login-heading" className="text-2xl">
            Anmelden
          </CardTitle>
          <CardDescription>
            Wähle einen Anbieter, um dich anzumelden.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {params.error && (
            <p className="text-sm text-destructive">{params.error}</p>
          )}
          {PROVIDERS.map((provider) => (
            <form key={provider.id} action={loginWithProvider}>
              <input type="hidden" name="provider" value={provider.id} />
              <Button type="submit" variant="outline" className="w-full">
                Mit {provider.label} anmelden
              </Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
