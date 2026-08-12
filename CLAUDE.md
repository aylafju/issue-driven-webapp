# CLAUDE.md – Regeln für die automatisierte Entwicklung

Dieses Repository wird issue-getrieben entwickelt: Jedes GitHub-Issue ist ein
Ticket, das von Claude (via GitHub Action) umgesetzt wird.

## Tech-Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4), Quellcode unter `src/`
- **shadcn/ui** für Basiskomponenten (`src/components/ui/`), verdrahtet auf die
  zentralen Design-Tokens in `src/app/globals.css` – siehe Abschnitt
  „Design-System"
- **Supabase** für Auth und Postgres-Datenbank
  (Client-Helper: `src/lib/supabase/client.ts` für Client Components,
  `src/lib/supabase/server.ts` für Server Components/Actions/Route Handler)
- **Vitest** + Testing Library für Tests (`*.test.tsx` neben der Komponente)
- **Deployment: Vercel** – deployt automatisch bei Push auf `main`;
  jeder PR bekommt eine Preview-URL. Es gibt KEINEN Deploy-Workflow im Repo.
- Geplant (noch nicht eingerichtet): Stripe für Subscriptions/Paywall.

## Befehle

- `npm run dev` – Dev-Server
- `npm test` – Tests (Vitest, einmaliger Lauf)
- `npm run build` – Produktions-Build (muss vor jedem PR fehlerfrei laufen)
- `npm run lint` – ESLint
- `npm run check:colors` – Grep-Check gegen rohe Farbklassen/Hex-Werte in `src/`
- `npx shadcn@latest add <component>` – neue shadcn/ui-Komponente hinzufügen

## Umgebungsvariablen

Siehe `.env.example`. Lokal in `.env.local` (nicht committen!), in CI/Vercel
als Secrets/Env-Vars. Niemals echte Keys ins Repo schreiben. Neue Variablen
immer auch in `.env.example` dokumentieren.

## Definition of Done (für jedes Issue)

1. Anforderung vollständig implementiert.
2. Tests geschrieben/aktualisiert, `npm test` grün.
3. `npm run build` läuft fehlerfrei.
4. Dokumentation aktualisiert (README.md bzw. docs/), wenn sich Verhalten,
   Bedienung oder Setup ändern.
5. Pull Request gegen `main` mit klarer Beschreibung und `Closes #<nr>`.

## Konventionen

- Branches: `claude/issue-<nr>-<kurzbeschreibung>`
- Kein direkter Push auf `main` – alles läuft über Pull Requests.
- Server-Logik (Auth-Checks, Premium-Gates, DB-Zugriffe) gehört auf die
  Server-Seite (Server Components, Route Handler, Middleware) – niemals
  sicherheitsrelevante Prüfungen nur im Client.
- Datenbank: Für JEDE neue Tabelle Row Level Security aktivieren
  (`alter table ... enable row level security;`) und passende Policies
  definieren (Standard: User sehen/ändern nur eigene Zeilen). Tabellen ohne
  RLS-Policies dürfen nicht in einen PR. Schema-Änderungen immer als
  SQL-Migration unter `supabase/migrations/` ins Repo legen und im PR
  beschreiben, damit sie nachvollziehbar im Supabase-Dashboard (SQL Editor)
  ausgeführt werden können.
- Sprache: UI-Texte und Doku auf Deutsch, Code/Kommentare auf Englisch.

## Design-System

- **Design-Richtung**: Dark-first, Orientierung an etablierten Trading-Tools
  (Referenz: TradingView) – sehr dunkle, leicht bläuliche Anthrazit-Flächen
  (kein reines Schwarz), dezente Abstufung Hintergrund → Panel/Card → Rand,
  eine klare Akzentfarbe (Blau) für Primäraktionen/aktive Zustände, dichte
  und funktionale Optik. Das dunkle Theme ist Default und startet ohne
  `prefers-color-scheme`-Automatismus; ein helles Theme ist mit denselben
  Token-Namen vorbereitet (`:root` in `src/app/globals.css`), aber aktuell
  nicht per Toggle erreichbar.
- **Tokens sind die einzige Quelle für Farben**: Alle Design-Tokens (Farben,
  `--radius`, Schriftfamilien) werden zentral per `@theme`/CSS-Variablen in
  `src/app/globals.css` definiert. Gewinn/Verlust-Werte ausschließlich über
  die semantischen Tokens `success`/`success-foreground` bzw.
  `danger`/`danger-foreground` einfärben (grün = positiv, rot = negativ) –
  nie ad hoc. Neue Tokens werden immer dort ergänzt, nie einzeln im
  Feature-Code definiert.
- **Keine rohen Farbwerte im Feature-Code**: Außerhalb von
  `src/app/globals.css` und `src/components/ui/` dürfen keine rohen
  Tailwind-Farbklassen (`bg-blue-500`, `text-gray-700`, …) oder Hex-Werte
  (`#fff`, …) verwendet werden – nur semantische Klassen wie `bg-background`,
  `text-foreground`, `bg-primary`, `text-success`. `npm run check:colors`
  prüft das per Grep-Script und läuft auch in CI.
- **UI-Elemente immer aus `src/components/ui/`** verwenden (shadcn/ui-Basis)
  bzw. dort um neue Komponenten ergänzen – keine ad-hoc-gestylten
  Buttons/Inputs/Cards im Feature-Code. Neue Komponenten mit
  `npx shadcn@latest add <component>` hinzufügen; sie sind bereits auf die
  Tokens aus `globals.css` verdrahtet.
- Zahlen in Tabellen/Listen (Kurse, Beträge, Prozentwerte) bekommen die
  Utility-Klasse `tabular-nums`, damit sie in Spalten sauber untereinander
  stehen (siehe Beispiel in `src/app/app/page.tsx`).

## Unklare Issues

Wenn ein Issue widersprüchlich, unklar oder nicht umsetzbar ist: nichts
implementieren, sondern Rückfragen als Issue-Kommentar stellen.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
