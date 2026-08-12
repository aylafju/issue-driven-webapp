import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getUserMock = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: getUserMock },
  })),
}));

import Home from "./page";

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

  it("zeigt Anmelden- und Registrieren-Links, wenn niemand angemeldet ist", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });
    render(await Home());
    expect(screen.getByRole("link", { name: /anmelden/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /registrieren/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /abmelden/i }),
    ).not.toBeInTheDocument();
  });

  it("zeigt E-Mail-Adresse und Logout-Button für angemeldete User", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { email: "test@example.com" } },
    });
    render(await Home());
    expect(screen.getByText(/test@example\.com/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /abmelden/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /anmelden/i }),
    ).not.toBeInTheDocument();
  });
});
