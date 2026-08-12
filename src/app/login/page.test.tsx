import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoginPage from "./page";

describe("Login-Seite", () => {
  it("zeigt E-Mail- und Passwort-Feld sowie Link zur Registrierung", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/passwort/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /anmelden/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /registrieren/i }),
    ).toBeInTheDocument();
  });

  it("zeigt eine Fehlermeldung aus den searchParams", async () => {
    render(
      await LoginPage({
        searchParams: Promise.resolve({ error: "Ungültige Anmeldedaten" }),
      }),
    );

    expect(screen.getByText(/ungültige anmeldedaten/i)).toBeInTheDocument();
  });

  it("zeigt eine Erfolgsmeldung aus den searchParams", async () => {
    render(
      await LoginPage({
        searchParams: Promise.resolve({ message: "Konto erstellt" }),
      }),
    );

    expect(screen.getByText(/konto erstellt/i)).toBeInTheDocument();
  });
});
