# CLAUDE.md – Regeln für die automatisierte Entwicklung

Dieses Repository wird issue-getrieben entwickelt: Jedes GitHub-Issue ist ein
Ticket, das von Claude (via GitHub Action) umgesetzt wird.

## Tech-Stack

Der Stack ist noch **nicht festgelegt**. Bis dahin gilt:
- Keine Frameworks oder Build-Tools einführen, solange kein Issue das
  ausdrücklich verlangt.
- Statisches HTML/CSS/JS ist der Ausgangspunkt (`index.html` im Root).
- Wird per Issue ein Stack festgelegt, diesen Abschnitt aktualisieren.

## Definition of Done (für jedes Issue)

1. Anforderung vollständig implementiert.
2. Tests geschrieben/aktualisiert und lokal grün (`npm test`, sobald ein
   Node-Projekt existiert).
3. Dokumentation aktualisiert (README.md bzw. docs/), wenn sich Verhalten,
   Bedienung oder Setup ändern.
4. Pull Request gegen `main` mit klarer Beschreibung und `Closes #<nr>`.

## Konventionen

- Branches: `claude/issue-<nr>-<kurzbeschreibung>`
- Kein direkter Push auf `main` – alles läuft über Pull Requests.
- Deployment: automatisch via GitHub Pages bei jedem Merge auf `main`
  (siehe `.github/workflows/deploy.yml`). Der Build muss dafür in `dist/`
  oder `build/` landen – oder das Root bleibt direkt deploybar.
- Sprache: UI-Texte und Doku auf Deutsch, Code/Kommentare auf Englisch.

## Unklare Issues

Wenn ein Issue widersprüchlich, unklar oder nicht umsetzbar ist: nichts
implementieren, sondern Rückfragen als Issue-Kommentar stellen.
