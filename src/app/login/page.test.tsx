import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import LoginPage from "./page";

describe("Login-Seite", () => {
  it("zeigt die Auswahl der Anmeldedienste als Popup", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mit google anmelden/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mit facebook anmelden/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /mit x anmelden/i }),
    ).not.toBeInTheDocument();
  });

  it("zeigt keine E-Mail- oder Passwort-Felder mehr", async () => {
    render(await LoginPage({ searchParams: Promise.resolve({}) }));

    expect(screen.queryByLabelText(/e-mail/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/passwort/i)).not.toBeInTheDocument();
  });

  it("zeigt eine Fehlermeldung aus den searchParams", async () => {
    render(
      await LoginPage({
        searchParams: Promise.resolve({ error: "Etwas ist schiefgelaufen." }),
      }),
    );

    expect(screen.getByText(/etwas ist schiefgelaufen/i)).toBeInTheDocument();
  });
});
