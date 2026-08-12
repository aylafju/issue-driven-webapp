import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SignupPage from "./page";

describe("Registrierungs-Seite", () => {
  it("zeigt E-Mail- und Passwort-Feld sowie Link zum Login", async () => {
    render(await SignupPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /registrieren/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /anmelden/i })).toBeInTheDocument();
  });

  it("zeigt eine Fehlermeldung aus den searchParams", async () => {
    render(
      await SignupPage({
        searchParams: Promise.resolve({ error: "E-Mail bereits vergeben" }),
      }),
    );

    expect(screen.getByText(/e-mail bereits vergeben/i)).toBeInTheDocument();
  });
});
