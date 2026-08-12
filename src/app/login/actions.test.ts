import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithPasswordMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signInWithPassword: signInWithPasswordMock },
  })),
}));

import { login } from "./actions";

function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  return digest.split(";").slice(2, -2).join(";");
}

function makeFormData(fields: Record<string, string>) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe("login-Action", () => {
  beforeEach(() => {
    signInWithPasswordMock.mockReset();
  });

  it("meldet mit E-Mail/Passwort an und leitet zur Startseite weiter", async () => {
    signInWithPasswordMock.mockResolvedValue({ error: null });

    const error = await login(
      makeFormData({ email: "test@example.com", password: "geheim123" }),
    ).catch((e) => e);

    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "geheim123",
    });
    expect(redirectTarget(error)).toBe("/");
  });

  it("leitet bei falschen Anmeldedaten mit Fehlermeldung zurück zu /login", async () => {
    signInWithPasswordMock.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });

    const error = await login(
      makeFormData({ email: "test@example.com", password: "falsch" }),
    ).catch((e) => e);

    const target = redirectTarget(error);
    expect(target).toContain("/login?error=");
    expect(decodeURIComponent(target)).toContain("falsch");
  });
});
