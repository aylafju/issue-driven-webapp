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
- [ ] Im Supabase-Dashboard unter Authentication → Sign In / Providers die
      OAuth-Provider **Google**, **Facebook** und **X (Twitter)** aktivieren
      und mit Client-ID/Secret des jeweiligen Anbieters hinterlegen
- [ ] Bei jedem Provider (Google Cloud Console, Facebook App, X Developer
      Portal) als Redirect-/Callback-URL die von Supabase angezeigte
      Callback-URL eintragen (`https://<project-ref>.supabase.co/auth/v1/callback`)

## Auth

Login (`/login`) läuft ausschließlich über Supabase Auth mit den OAuth-
Providern **Google**, **Facebook** und **X**. Die Login-Seite zeigt ein
Popup mit der Auswahl des Providers; nach der Anmeldung beim Provider leitet
`/auth/callback` zurück auf die Startseite. E-Mail/Passwort-Login und
-Registrierung gibt es nicht mehr. Eingeloggte User sehen auf der Startseite
ihre E-Mail-Adresse und einen Logout-Button. `src/proxy.ts` refresht bei
jedem Request die Supabase-Session, damit Server Components immer eine
aktuelle Auth-Session sehen.
