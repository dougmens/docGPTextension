# SPEC.md — ChatGPT Sidebar für Google Docs

## 1. Ziel
Ein kommerziell nutzbares Google Docs Add-on (Apps Script) mit einer Sidebar rechts,
in der Nutzer mit ChatGPT chatten können.
Die KI kann optional Dokumentkontext nutzen und Texte sicher in Google Docs einfügen
oder ersetzen (kontrolliert, transparent, rückgängig machbar via Docs-Undo).

## 2. Nicht-Ziele (explizit)
- Keine OCR/PDF-Verarbeitung
- Keine Team-/Mehrnutzerverwaltung
- Kein externes Backend
- Keine automatische Veröffentlichung im Marketplace
- Keine stillen Dokumentänderungen ohne Nutzeraktion

## 3. Kernfunktionen (Version 1.0)
### 3.1 Chat
- Sidebar mit Chat-Verlauf
- Mehrzeiliges Eingabefeld
- „Senden“-Aktion

### 3.2 Kontextsteuerung
- Nur Chat (kein Dokumenttext)
- Mit Markierung
- Mit ganzem Dokument (mit explizitem Warnhinweis)
- Anzeige der gesendeten Zeichenanzahl
- Automatische Kürzung bei > 60.000 Zeichen (letzte 60.000 Zeichen)

### 3.3 Modi (Prompt-Presets)
- Allgemein
- Schriftsatz (DE, juristisch)
- Überarbeiten (klar/knapp)

### 3.4 Dokument-Aktionen
- Antwort nur anzeigen
- Antwort an Cursor einfügen
- Markierten Text ersetzen
- (Optional) Ganzes Dokument ersetzen:
  - zweistufige Bestätigung erforderlich

## 4. UX- & Sicherheitsregeln
- Keine Dokumentänderung ohne expliziten Button-Klick
- „Ganzes Dokument ersetzen“ immer mit Warnung + Bestätigung
- Fehlermeldungen klar und nutzerverständlich anzeigen
- Kein API-Key im Code (nur Script Properties)

## 5. Technische Architektur
- Google Apps Script (V8)
- Container-bound Script (für Tests)
- Sidebar via HtmlService
- Client → Server via google.script.run
- ChatGPT via OpenAI Chat Completions API
- API-Key: Script Properties (`OPENAI_API_KEY`)

## 6. OpenAI-Konfiguration
- Endpoint: https://api.openai.com/v1/chat/completions
- Default-Modell: gpt-4o-mini (oder stabiles günstiges Chat-Modell)
- Messages:
  - system: abhängig vom Modus
  - user: Nutzeranweisung + optional Kontext
- Keine erfundenen Fakten im juristischen Modus
- Fehlende Informationen mit [BITTE ERGÄNZEN] markieren

## 7. Dateien
- appsscript.json
- Code.gs
- Sidebar.html
- README.md

## 8. Iterationsregel (wichtig)
Bei jeder Änderung:
- Diese SPEC.md erneut hochladen
- Nur die betroffenen Dateien ändern lassen
- Geänderte Dateien vollständig ausgeben lassen
- Keine stillen Strukturänderungen außerhalb der SPEC.md

## 9. Qualität
- Sauberer, robuster Code
- Keine TODOs in produktivem Code
- Keine nicht dokumentierten Features
