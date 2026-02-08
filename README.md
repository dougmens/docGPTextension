# ChatGPT Sidebar für Google Docs (Apps Script Add-on)

Dieses Repo enthält die **Quellbasis** für ein Google Docs Add-on mit einer Sidebar rechts,
die ChatGPT (OpenAI API) in Google Docs integriert.

## Repo-Struktur

- `apps-script/`  
  Enthält die Apps-Script-Dateien: `Code.gs`, `Sidebar.html`, `appsscript.json`

- `spec/`  
  Single Source of Truth für Spezifikation & Iterationen:
  - `SPEC.md`
  - `CHANGELOG.md`
  - `BACKLOG.md`

## Schnellstart (lokal im eigenen Google Doc testen)

1. Google Doc öffnen → **Erweiterungen → Apps Script**
2. Dateien im Apps-Script-Editor anlegen und Inhalte aus `apps-script/` einfügen:
   - `Code.gs`
   - `Sidebar.html`
   - `appsscript.json` (Manifest)
3. Apps Script → **Projekt-Einstellungen** → **Script Properties**
   - `OPENAI_API_KEY` = <dein Key>
4. Google Doc neu laden → Menü **„ChatGPT Sidebar“** → **Sidebar öffnen**

## Iteratives Arbeiten mit Grok (empfohlen)

Bei jeder Iteration:
1. `spec/SPEC.md` + `spec/CHANGELOG.md` hochladen
2. Zusätzlich nur die betroffenen Dateien aus `apps-script/` hochladen (z. B. `Code.gs`)
3. Grok anweisen: **„Ändere nur diese Dateien, gib jede geänderte Datei vollständig aus.“**
4. Änderungen in Git committen

## Optional: Synchronisation per clasp (später)

Wenn du nicht mehr manuell kopieren willst, kannst du das Repo mit Apps Script synchronisieren.
Das Google-Tool heißt `clasp`. Empfehlung: erst nach Version 1.0 umsteigen.

## Lizenz / Hinweis

Dieses Repo ist eine Entwicklungsbasis. Für eine Marketplace-Veröffentlichung benötigst du u.a.:
- Privacy Policy
- ggf. Terms
- ggf. Branding & Support-URL

