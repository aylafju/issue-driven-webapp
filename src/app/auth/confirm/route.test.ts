import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const verifyOtpMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { verifyOtp: verifyOtpMock },
  })),
}));

import { GET } from "./route";

function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  return digest.split(";").slice(2, -2).join(";");
}

describe("GET /auth/confirm", () => {
  beforeEach(() => {
    verifyOtpMock.mockReset();
  });

  it("bestätigt einen gültigen Token und leitet zum Ziel weiter", async () => {
    verifyOtpMock.mockResolvedValue({ error: null });
    const request = new NextRequest(
      "https://example.com/auth/confirm?token_hash=abc123&type=signup&next=/",
    );

    const error = await GET(request).catch((e) => e);

    expect(verifyOtpMock).toHaveBeenCalledWith({
      type: "signup",
      token_hash: "abc123",
    });
    expect(redirectTarget(error)).toBe("/");
  });

  it("leitet bei ungültigem Token zu /login mit Fehlermeldung", async () => {
    verifyOtpMock.mockResolvedValue({ error: { message: "invalid token" } });
    const request = new NextRequest(
      "https://example.com/auth/confirm?token_hash=abc123&type=signup",
    );

    const error = await GET(request).catch((e) => e);

    expect(redirectTarget(error)).toContain("/login?error=");
  });

  it("leitet ohne Token-Parameter direkt zu /login mit Fehlermeldung", async () => {
    const request = new NextRequest("https://example.com/auth/confirm");

    const error = await GET(request).catch((e) => e);

    expect(verifyOtpMock).not.toHaveBeenCalled();
    expect(redirectTarget(error)).toContain("/login?error=");
  });
});
