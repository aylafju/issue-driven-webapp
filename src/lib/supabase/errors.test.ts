import { describe, expect, it } from "vitest";

import { mapAuthError } from "./errors";

describe("mapAuthError", () => {
  it("übersetzt einen deaktivierten Provider", () => {
    expect(mapAuthError("provider is not enabled")).toMatch(/nicht verfügbar/i);
  });

  it("fällt bei unbekannten Fehlern auf eine generische Meldung zurück", () => {
    expect(mapAuthError("something totally unexpected")).toMatch(
      /schiefgelaufen/i,
    );
  });
});
