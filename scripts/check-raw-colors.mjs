#!/usr/bin/env node
// Grep-Check für CLAUDE.md, Abschnitt "Design-System": Innerhalb von src/
// dürfen außerhalb von globals.css und components/ui/ keine rohen
// Tailwind-Farbklassen oder Hex-Farbwerte vorkommen – nur semantische
// Design-Tokens (bg-background, text-foreground, bg-primary, text-success, …).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC_DIR = join(import.meta.dirname, "..", "src");
const EXCLUDED_PATHS = [join(SRC_DIR, "components", "ui")];
const EXCLUDED_FILES = new Set([join(SRC_DIR, "app", "globals.css")]);
const CHECKED_EXTENSIONS = new Set([".ts", ".tsx", ".css"]);

const RAW_COLOR_NAMES =
  "slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white";
const UTILITY_PREFIXES =
  "bg|text|border|ring|ring-offset|fill|stroke|from|via|to|divide|outline|decoration|accent|caret|shadow";

const RAW_COLOR_CLASS = new RegExp(
  `\\b(?:${UTILITY_PREFIXES})-(?:${RAW_COLOR_NAMES})(?:-\\d{2,3})?\\b`,
  "g",
);
const HEX_COLOR = /#[0-9a-fA-F]{3,8}\b/g;

function collectFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (EXCLUDED_PATHS.includes(fullPath)) continue;
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else if (CHECKED_EXTENSIONS.has(fullPath.slice(fullPath.lastIndexOf(".")))) {
      if (!EXCLUDED_FILES.has(fullPath)) files.push(fullPath);
    }
  }
  return files;
}

const violations = [];
for (const file of collectFiles(SRC_DIR)) {
  const content = readFileSync(file, "utf8");
  for (const pattern of [RAW_COLOR_CLASS, HEX_COLOR]) {
    for (const match of content.matchAll(pattern)) {
      const line = content.slice(0, match.index).split("\n").length;
      violations.push(`${relative(process.cwd(), file)}:${line}: "${match[0]}"`);
    }
  }
}

if (violations.length > 0) {
  console.error(
    "Rohe Farbklassen/Hex-Werte gefunden – nur semantische Design-Tokens verwenden (siehe CLAUDE.md, Abschnitt \"Design-System\"):\n",
  );
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log("Keine rohen Farbklassen/Hex-Werte in src/ gefunden.");
