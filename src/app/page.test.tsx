import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: getUserMock },
  })),
}));

import Home from "./page";

function redirectTarget(error: unknown): string {
  const digest = (error as { digest?: string }).digest ?? "";
  return digest.split(";").slice(2, -2).join(";");
}

describe("Startseite", () => {
  beforeEach(() => {
    getUserMock.mockReset();
  });

  it("zeigt die Überschrift", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    render(await Home());
    expect(
      screen.getByRole("heading", { name: /im aufbau/i }),
    ).toBeInTheDocument();
  });

  it("zeigt den Versions-Footer", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    render(await Home());
    expect(
      screen.getByText(/automatisch entwickelt mit claude/i),
    ).toBeInTheDocument();
  });

  it("zeigt einen Anmelden-Link, wenn niemand angemeldet ist", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    render(await Home());
    expect(screen.getByRole("link", { name: /anmelden/i })).toBeInTheDocument();
  });

  it("leitet angemeldete User zur App-View weiter", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { email: "test@example.com" } },
    });

    const error = await Home().catch((e) => e);

    expect(redirectTarget(error)).toBe("/app");
  });
});
