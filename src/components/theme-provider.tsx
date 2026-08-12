"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// Dark ist das einzige aktuell erreichbare Theme (kein Toggle, keine
// System-Präferenz). forcedTheme sorgt dafür, dass next-themes die Klasse
// "dark" auf <html> setzt, bevor das erste Frame gemalt wird.
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
