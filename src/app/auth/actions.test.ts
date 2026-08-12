import { beforeEach, describe, expect, it, vi } from "vitest";

const signOutMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signOut: signOutMock },
  })),
}));

import { logout } from "./actions";

function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  return digest.split(";").slice(2, -2).join(";");
}

describe("logout-Action", () => {
  beforeEach(() => {
    signOutMock.mockReset();
  });

  it("meldet ab und leitet zur Startseite weiter", async () => {
    signOutMock.mockResolvedValue({ error: null });

    const error = await logout().catch((e) => e);

    expect(signOutMock).toHaveBeenCalled();
    expect(redirectTarget(error)).toBe("/");
  });
});
