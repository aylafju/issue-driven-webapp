# issue-driven-webapp

Eine Web-App, die vollständig **issue-getrieben** entwickelt wird: Features und
Bugfixes werden als GitHub-Issues angelegt und von Claude automatisch
implementiert, getestet, dokumentiert und als Pull Request bereitgestellt.
Nach dem Merge deployt Vercel automatisch.

## Der Prozess

1. **Issue anlegen** – Anforderung als Ticket beschreiben (am besten mit
   Akzeptanzkriterien, es gibt eine Issue-Vorlage).
2. **Claude implementiert** – die GitHub Action
   [claude-issue.yml](.github/workflows/claude-issue.yml) startet automatisch,
   setzt das Issue um, schreibt Tests, aktualisiert die Doku und eröffnet
   einen Pull Request. Rückfragen stellt Claude als Issue-Kommentar
   (antworten mit `@claude ...` startet einen neuen Lauf).
3. **Review & Merge** – PR prüfen (Vercel hängt an jeden PR eine Preview-URL)
   und mergen; das Issue schließt sich automatisch über `Closes #<nr>`.
4. **Auto-Deploy** – Vercel deployt jeden Push auf `main` in Produktion.

Zusätzlich prüft [ci.yml](.github/workflows/ci.yml) Tests und Build bei jedem
Pull Request.

## Tech-Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Tailwind CSS)
- [shadcn/ui](https://ui.shadcn.com) – Basiskomponenten, verdrahtet auf die
  zentralen Design-Tokens (siehe [Design-System](#design-system))
- [Supabase](https://supabase.com) – Auth + Postgres
- [Vitest](https://vitest.dev) + Testing Library – Tests
- [Vercel](https://vercel.com) – Hosting/Deployment
- Geplant: Stripe für Subscriptions/Paywall

## Lokal entwickeln

```bash
npm install
cp .env.example .env.local   # Supabase-Werte eintragen
npm run dev                  # http://localhost:3000
npm test                     # Tests
npm run build                # Produktions-Build
```

## Einmaliges Setup (Checkliste)

- [x] Repo auf GitHub, Claude GitHub App + `CLAUDE_CODE_OAUTH_TOKEN`-Secret
- [ ] Supabase-Projekt anlegen (<https://supabase.com>), URL + Anon-Key aus
      Project Settings → API kopieren
- [ ] Vercel-Projekt anlegen (<https://vercel.com>): "Import Git Repository"
      → dieses Repo wählen (Next.js wird automatisch erkannt)
- [ ] In Vercel die Env-Vars `NEXT_PUBLIC_SUPABASE_URL` und
      `NEXT_PUBLIC_SUPABASE_ANON_KEY` setzen (siehe `.env.example`)
- [ ] Im Supabase-Dashboard unter Authentication → Sign In / Providers den
      OAuth-Provider **Google** aktivieren und mit Client-ID/Secret des
      Anbieters hinterlegen
- [ ] Bei Google Cloud Console als Redirect-/Callback-URL die von Supabase
      angezeigte Callback-URL eintragen
      (`https://<project-ref>.supabase.co/auth/v1/callback`)

## Auth

Login (`/login`) läuft ausschließlich über Supabase Auth mit dem OAuth-
Provider **Google**. Die Login-Seite zeigt ein
Popup mit der Auswahl des Providers; nach der Anmeldung beim Provider leitet
`/auth/callback` zur geschützten App-View (`/app`) weiter. E-Mail/Passwort-
Login und -Registrierung gibt es nicht mehr. `src/proxy.ts` refresht bei
jedem Request die Supabase-Session, damit Server Components immer eine
aktuelle Auth-Session sehen.

## Homepage & App-View

Die Startseite (`/`) ist eine öffentliche Landingpage mit Anmelden-Link.
Angemeldete User werden von dort automatisch zur App-View (`/app`)
weitergeleitet. Die App-View ist nur für angemeldete User erreichbar – ohne
gültige Session leitet sie zurück zu `/login`. Dort sehen eingeloggte User
ihre E-Mail-Adresse und einen Logout-Button.

## Design-System

Das UI ist dark-first und orientiert sich an etablierten Trading-Tools
(Referenz: [TradingView](https://www.tradingview.com)) – dunkle, leicht
bläuliche Anthrazit-Flächen, dezente Ränder statt starker Schatten und eine
klare Akzentfarbe für Primäraktionen. Details und Regeln für neuen Code
stehen in [CLAUDE.md](CLAUDE.md#design-system).

- **Tokens ändern**: Alle Farben, `--radius` und Schriftfamilien sind als
  CSS-Variablen zentral in [`src/app/globals.css`](src/app/globals.css)
  definiert (`:root` = helles Theme, vorbereitet aber noch nicht per Toggle
  erreichbar; `.dark` = dunkles Theme, aktueller Default). Das komplette
  Farbschema der App lässt sich austauschen, indem ausschließlich diese
  Werte geändert werden – kein Code außerhalb dieser Datei muss angefasst
  werden.
- **Gewinn/Verlust**: Die Tokens `success`/`success-foreground` (positiv,
  grün) und `danger`/`danger-foreground` (negativ, rot) sind eigene
  semantische Tokens, siehe Beispiel in
  [`src/app/app/page.tsx`](src/app/app/page.tsx).
- **Neue shadcn-Komponente hinzufügen**:
  ```bash
  npx shadcn@latest add <component>
  ```
  Die Komponente landet unter `src/components/ui/` und ist bereits auf die
  Tokens aus `globals.css` verdrahtet.
- **Prüfen**: `npm run check:colors` meldet rohe Tailwind-Farbklassen
  (`bg-blue-500`, …) oder Hex-Werte (`#fff`, …) außerhalb von
  `globals.css`/`components/ui/`; läuft auch in [ci.yml](.github/workflows/ci.yml).
