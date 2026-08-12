import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const exchangeCodeForSessionMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { exchangeCodeForSession: exchangeCodeForSessionMock },
  })),
}));

import { GET } from "./route";

function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  return digest.split(";").slice(2, -2).join(";");
}

describe("GET /auth/callback", () => {
  beforeEach(() => {
    exchangeCodeForSessionMock.mockReset();
  });

  it("tauscht einen gültigen Code gegen eine Session und leitet zum Ziel weiter", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({ error: null });
    const request = new NextRequest(
      "https://example.com/auth/callback?code=abc123&next=/",
    );

    const error = await GET(request).catch((e) => e);

    expect(exchangeCodeForSessionMock).toHaveBeenCalledWith("abc123");
    expect(redirectTarget(error)).toBe("/");
  });

  it("leitet ohne next-Parameter zur App-View weiter", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({ error: null });
    const request = new NextRequest(
      "https://example.com/auth/callback?code=abc123",
    );

    const error = await GET(request).catch((e) => e);

    expect(redirectTarget(error)).toBe("/app");
  });

  it("leitet bei fehlerhaftem Code zu /login mit Fehlermeldung", async () => {
    exchangeCodeForSessionMock.mockResolvedValue({
      error: { message: "invalid code" },
    });
    const request = new NextRequest(
      "https://example.com/auth/callback?code=abc123",
    );

    const error = await GET(request).catch((e) => e);

    expect(redirectTarget(error)).toContain("/login?error=");
  });

  it("leitet ohne Code-Parameter direkt zu /login mit Fehlermeldung", async () => {
    const request = new NextRequest("https://example.com/auth/callback");

    const error = await GET(request).catch((e) => e);

    expect(exchangeCodeForSessionMock).not.toHaveBeenCalled();
    expect(redirectTarget(error)).toContain("/login?error=");
  });
});
