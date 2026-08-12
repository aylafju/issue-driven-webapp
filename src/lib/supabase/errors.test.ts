import { describe, expect, it } from "vitest";

import { mapAuthError } from "./errors";

describe("mapAuthError", () => {
  it("übersetzt falsche Anmeldedaten", () => {
    expect(mapAuthError("Invalid login credentials")).toMatch(
      /falsch/i,
    );
  });

  it("übersetzt bereits registrierte E-Mail-Adressen", () => {
    expect(mapAuthError("User already registered")).toMatch(/existiert/i);
  });

  it("übersetzt zu kurze Passwörter", () => {
    expect(mapAuthError("Password should be at least 6 characters")).toMatch(
      /mindestens/i,
    );
  });

  it("fällt bei unbekannten Fehlern auf eine generische Meldung zurück", () => {
    expect(mapAuthError("something totally unexpected")).toMatch(
      /schiefgelaufen/i,
    );
  });
});
