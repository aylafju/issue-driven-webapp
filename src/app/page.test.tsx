import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Startseite", () => {
  it("zeigt die Überschrift", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /im aufbau/i }),
    ).toBeInTheDocument();
  });

  it("zeigt den Versions-Footer", () => {
    render(<Home />);
    expect(
      screen.getByText(/automatisch entwickelt mit claude/i),
    ).toBeInTheDocument();
  });
});
