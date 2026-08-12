import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: getUserMock },
  })),
}));

import AppView from "./page";

function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  return digest.split(";").slice(2, -2).join(";");
}

describe("App-View", () => {
  beforeEach(() => {
    getUserMock.mockReset();
  });

  it("leitet nicht angemeldete User zur Login-Seite weiter", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });

    const error = await AppView().catch((e) => e);

    expect(redirectTarget(error)).toBe("/login");
  });

  it("zeigt E-Mail-Adresse und Logout-Button für angemeldete User", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { email: "test@example.com" } },
    });

    render(await AppView());

    expect(screen.getByText(/test@example\.com/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /abmelden/i }),
    ).toBeInTheDocument();
  });
});
