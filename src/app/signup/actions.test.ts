import { beforeEach, describe, expect, it, vi } from "vitest";

const signUpMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signUp: signUpMock },
  })),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Map([["origin", "https://example.com"]])),
}));

import { signup } from "./actions";

function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  return digest.split(";").slice(2, -2).join(";");
}

function makeFormData(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe("signup-Action", () => {
  beforeEach(() => {
    signUpMock.mockReset();
  });

  it("registriert und leitet mit Hinweis zur Login-Seite weiter, wenn Bestätigung nötig ist", async () => {
    signUpMock.mockResolvedValue({ data: { session: null }, error: null });

    const error = await signup(
      makeFormData({ email: "neu@example.com", password: "geheim123" }),
    ).catch((e) => e);

    expect(signUpMock).toHaveBeenCalledWith({
      email: "neu@example.com",
      password: "geheim123",
      options: { emailRedirectTo: "https://example.com/auth/confirm" },
    });
    const target = redirectTarget(error);
    expect(target).toContain("/login?message=");
  });

  it("leitet direkt zur Startseite weiter, wenn keine Bestätigung nötig ist", async () => {
    signUpMock.mockResolvedValue({
      data: { session: { access_token: "token" } },
      error: null,
    });

    const error = await signup(
      makeFormData({ email: "neu@example.com", password: "geheim123" }),
    ).catch((e) => e);

    expect(redirectTarget(error)).toBe("/");
  });

  it("leitet bei Fehler mit Meldung zurück zu /signup", async () => {
    signUpMock.mockResolvedValue({
      data: { session: null },
      error: { message: "User already registered" },
    });

    const error = await signup(
      makeFormData({ email: "schon@example.com", password: "geheim123" }),
    ).catch((e) => e);

    const target = redirectTarget(error);
    expect(target).toContain("/signup?error=");
    expect(decodeURIComponent(target)).toContain("existiert bereits");
  });
});
