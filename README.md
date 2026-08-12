# issue-driven-webapp

Eine Web-App, die vollständig **issue-getrieben** entwickelt wird: Features und
Bugfixes werden als GitHub-Issues angelegt und von Claude automatisch
implementiert, getestet, dokumentiert und als Pull Request bereitgestellt.
Nach dem Merge wird automatisch deployt.

## Der Prozess

1. **Issue anlegen** – Anforderung als Ticket beschreiben (am besten mit
   Akzeptanzkriterien, es gibt eine Issue-Vorlage).
2. **Claude implementiert** – die GitHub Action
   [claude-issue.yml](.github/workflows/claude-issue.yml) startet automatisch,
   setzt das Issue um, schreibt Tests, aktualisiert die Doku und eröffnet
   einen Pull Request. Rückfragen stellt Claude als Issue-Kommentar
   (antworten mit `@claude ...` startet einen neuen Lauf).
3. **Review & Merge** – PR prüfen und mergen (das Issue schließt sich
   automatisch über `Closes #<nr>`).
4. **Auto-Deploy** – der Merge auf `main` löst
   [deploy.yml](.github/workflows/deploy.yml) aus und veröffentlicht die App
   auf GitHub Pages.

Zusätzlich prüft [ci.yml](.github/workflows/ci.yml) Tests und Build bei jedem
Pull Request.

## Einmaliges Setup (Checkliste)

- [ ] Repo auf GitHub anlegen und pushen (öffentlich, wegen GitHub Pages).
- [ ] Claude GitHub App installieren: im Claude-Code-Terminal
      `/install-github-app` ausführen (empfohlen) oder manuell über
      <https://github.com/apps/claude> – dabei nur dieses Repository freigeben.
- [ ] Ein Secret im Repo hinterlegen (Settings → Secrets and variables →
      Actions): `ANTHROPIC_API_KEY` **oder** `CLAUDE_CODE_OAUTH_TOKEN`
      (letzteres per `claude setup-token` bei Pro/Max-Abo –
      `/install-github-app` erledigt das automatisch mit).
- [ ] GitHub Pages aktivieren: Settings → Pages → Source: **GitHub Actions**.
- [ ] Testlauf: ein erstes Issue anlegen.

## Tech-Stack

Noch nicht festgelegt – Ausgangspunkt ist statisches HTML
([index.html](index.html)). Der Stack wird per Issue entschieden; die
Workflows erkennen ein Node-Projekt (package.json) automatisch.
