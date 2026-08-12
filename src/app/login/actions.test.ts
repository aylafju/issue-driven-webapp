import { beforeEach, describe, expect, it } from "vitest";
import { vi } from "vitest";

const signInWithOAuthMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signInWithOAuth: signInWithOAuthMock },
  })),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Map([["origin", "https://example.com"]])),
}));

import { loginWithProvider } from "./actions";

function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  return digest.split(";").slice(2, -2).join(";");
}

function makeFormData(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe("loginWithProvider-Action", () => {
  beforeEach(() => {
    signInWithOAuthMock.mockReset();
  });

  it("startet den OAuth-Flow für Google und leitet zur Provider-URL weiter", async () => {
    signInWithOAuthMock.mockResolvedValue({
      data: { url: "https://accounts.google.com/o/oauth2/auth?foo=bar" },
      error: null,
    });

    const error = await loginWithProvider(
      makeFormData({ provider: "google" }),
    ).catch((e) => e);

    expect(signInWithOAuthMock).toHaveBeenCalledWith({
      provider: "google",
      options: { redirectTo: expect.stringContaining("/auth/callback") },
    });
    expect(redirectTarget(error)).toBe(
      "https://accounts.google.com/o/oauth2/auth?foo=bar",
    );
  });

  it("leitet bei unbekanntem Provider mit Fehlermeldung zurück zu /login", async () => {
    const error = await loginWithProvider(
      makeFormData({ provider: "not-a-provider" }),
    ).catch((e) => e);

    expect(signInWithOAuthMock).not.toHaveBeenCalled();
    expect(redirectTarget(error)).toContain("/login?error=");
  });

  it("leitet bei entfernten Anbietern (Facebook/X) mit Fehlermeldung zurück zu /login", async () => {
    const facebookError = await loginWithProvider(
      makeFormData({ provider: "facebook" }),
    ).catch((e) => e);
    const twitterError = await loginWithProvider(
      makeFormData({ provider: "twitter" }),
    ).catch((e) => e);

    expect(signInWithOAuthMock).not.toHaveBeenCalled();
    expect(redirectTarget(facebookError)).toContain("/login?error=");
    expect(redirectTarget(twitterError)).toContain("/login?error=");
  });

  it("leitet bei einem Supabase-Fehler mit Fehlermeldung zurück zu /login", async () => {
    signInWithOAuthMock.mockResolvedValue({
      data: { url: null },
      error: { message: "provider is not enabled" },
    });

    const error = await loginWithProvider(
      makeFormData({ provider: "google" }),
    ).catch((e) => e);

    const target = redirectTarget(error);
    expect(target).toContain("/login?error=");
    expect(decodeURIComponent(target)).toContain("nicht verfügbar");
  });
});
