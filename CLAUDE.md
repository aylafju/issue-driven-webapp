# CLAUDE.md – Regeln für die automatisierte Entwicklung

Dieses Repository wird issue-getrieben entwickelt: Jedes GitHub-Issue ist ein
Ticket, das von Claude (via GitHub Action) umgesetzt wird.

## Tech-Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS 4), Quellcode unter `src/`
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
- Sprache: UI-Texte und Doku auf Deutsch, Code/Kommentare auf Englisch.

## Unklare Issues

Wenn ein Issue widersprüchlich, unklar oder nicht umsetzbar ist: nichts
implementieren, sondern Rückfragen als Issue-Kommentar stellen.
