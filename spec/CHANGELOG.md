# CHANGELOG.md — ChatGPT Sidebar für Google Docs

Dieses Changelog dokumentiert **alle funktionalen und technischen Änderungen** am Add-on.
Es dient als Referenz für iterative Entwicklung mit Grok (oder anderen Code-Generatoren)
und als interne Nachvollziehbarkeit für Marketplace- und Support-Zwecke.

---

## [Unreleased]
### Geplant
- Erste lauffähige Version (Version 1.0)
- Sidebar-Chat mit ChatGPT
- Kontextwahl: Nur Chat / Markierung / Ganzes Dokument
- Schriftsatz-Modus (DE, juristisch)
- Überarbeiten-Modus
- Sichere Dokumentaktionen (Einfügen / Ersetzen)

---

## [1.0.0] — Initiale kommerzielle Version
### Added
- Google Docs Add-on mit Sidebar („ChatGPT Sidebar“)
- Chat-Verlauf in der Sidebar
- Kontextsteuerung:
  - Nur Chat
  - Mit Markierung
  - Mit ganzem Dokument (mit Warnhinweis)
- Zeichenanzahl-Anzeige für gesendeten Kontext
- Automatische Kontextkürzung bei > 60.000 Zeichen
- Modi:
  - Allgemein
  - Schriftsatz (DE, juristisch)
  - Überarbeiten (klar/knapp)
- Dokumentaktionen:
  - Antwort anzeigen
  - Antwort an Cursor einfügen
  - Markierten Text ersetzen
- OpenAI API Integration (Chat Completions)
- API-Key-Verwaltung über Script Properties
- Klare Fehlermeldungen bei:
  - fehlendem API-Key
  - fehlender Markierung
  - API-/Netzwerkfehlern

### Security
- Keine stillen Dokumentänderungen
- Kein API-Key im Code
- Explizite Nutzeraktion für jede Änderung

---

## [1.1.0] — Qualitäts- & UX-Verbesserungen (geplant)
### Added
- Diff-Vorschau vor dem Anwenden von Änderungen
- Verbesserte Lade-/Busy-Anzeige in der Sidebar
- Bessere Fehlertexte für Endnutzer

### Changed
- Optimierung der Prompt-Struktur für stabilere Antworten
- Feinere Steuerung von temperature/max_tokens je Modus

---

## [1.2.0] — Produktivitätsfunktionen (geplant)
### Added
- Schriftsatz-Wizard (Schritt-für-Schritt)
- Option „Als neuen Abschnitt einfügen“
- Eigene Prompt-Presets (lokal)

---

## [2.0.0] — Erweiterte Nutzung (optional, Zukunft)
### Added
- Versionierung / Änderungsverlauf
- Rollback-Funktion
- Team-/Mehrnutzerfähigkeit
- Optionale Marketplace-Veröffentlichung

---

## Hinweise zur Nutzung mit Grok
- Bei **jeder Iteration**:
  - Diese CHANGELOG.md zusammen mit SPEC.md hochladen
  - Änderungen im Abschnitt [Unreleased] oder neue Version ergänzen
- Grok darf **nur die betroffenen Dateien ändern**
- Keine impliziten Feature-Erweiterungen ohne Eintrag im Changelog
