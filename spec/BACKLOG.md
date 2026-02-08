# BACKLOG.md — ChatGPT Sidebar für Google Docs

Dieses Backlog ist die **Roadmap** für die Weiterentwicklung.  
Regel: Neue Features zuerst hier aufnehmen (kurz), dann in SPEC.md konkretisieren.

---

## Version 1.0 — „Verkaufsfähige Basis“
### Muss (Go-Live)
- [ ] Sidebar-Chat (Verlauf, Eingabe, Senden)
- [ ] Kontextwahl: Nur Chat / Markierung / Ganzes Dokument + Warnhinweis
- [ ] Zeichenanzahl + Kürzung bei > 60.000 Zeichen (Hinweis im UI)
- [ ] Modi: Allgemein / Schriftsatz (DE) / Überarbeiten
- [ ] Aktionen: Antwort einfügen / Markierung ersetzen
- [ ] OpenAI API Call (Chat Completions) + robuste Fehlertexte
- [ ] API-Key via Script Properties (OPENAI_API_KEY)
- [ ] README: Setup + Testen + Troubleshooting

### Sollte (wenn ohne Risiko)
- [ ] „Als neuen Abschnitt ans Ende“ einfügen
- [ ] Clear Chat Verlauf Button
- [ ] „Kopieren“-Button für letzte Antwort
- [ ] Busy-State (Spinner) + Disable Buttons während Request

---

## Version 1.1 — UX & Stabilität
- [ ] Diff-Preview in Sidebar (Vorher/Nachher) vor „Ersetzen“
- [ ] Verbesserte Auswahl-Logik (auch wenn Cursor statt Markierung)
- [ ] Fehlerklassifikation (401/429/5xx) mit passenden Hinweisen
- [ ] Konfigurierbares Modell (Dropdown, optional) + Default stabil
- [ ] Prompt-Härtung für „Schriftsatz“ (Platzhalter statt Halluzinationen)

---

## Version 1.2 — Schriftsatz-Wizard (DE, juristisch)
- [ ] Wizard: Dokumenttyp (Klage/Erwiderung/Antrag/Stellungnahme)
- [ ] Wizard: Gericht/Parteien optional (Textfelder)
- [ ] Wizard: Sachverhalt-Quelle (Markierung/Doc)
- [ ] Output: Entwurf mit [BITTE ERGÄNZEN]-Blöcken
- [ ] Optional: Anlagenverzeichnis-Generator (aus Liste)

---

## Version 1.3 — Presets & Wiederverwendung
- [ ] Nutzer-Presets speichern (lokal) (Name → Systemprompt + Parameter)
- [ ] Ton-Dropdown: neutral/formal/sehr formal (Modulator)
- [ ] Glossar/Terminologie-Liste (einfach): „Begriff A → Begriff B“

---

## Version 2.0 — Kommerzieller Betrieb & Marketplace
- [ ] Standalone Add-on (nicht nur container-bound) / Deployment-Konzept
- [ ] Privacy Policy & Terms (Marketplace-tauglich)
- [ ] Telemetrie optional (nur anonym, opt-in) + Support-Logs
- [ ] Lizenzmodell (Subscription/Seat) — ohne API-Key beim Nutzer (Backend erforderlich)
- [ ] Team-Funktionen / Workspace-Admin Presets (optional)

---

## Notizen
- „Ganzes Dokument ersetzen“ bleibt optional und benötigt zweistufige Bestätigung.
- OCR/PDF Import ist bewusst ausgeschlossen (separates Modul/Produkt).
