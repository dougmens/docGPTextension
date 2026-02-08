ChatGPT Sidebar für Google Docs
Ein Google Docs Add-on, das eine Sidebar mit ChatGPT-Integration bereitstellt.
Funktionen (Version 1.0.0)

Sidebar-Chat mit OpenAI (ChatGPT)
Kontextoptionen: Nur Chat / Mit Markierung / Mit ganzem Dokument
Zeichenanzahl-Anzeige und automatische Kontextkürzung (>60.000 Zeichen)
Drei Modi: Allgemein, Schriftsatz (juristisch DE), Überarbeiten
Aktionen: Antwort anzeigen, an Cursor einfügen, markierten Text ersetzen

Installation / Einrichtung

Öffnen Sie ein Google Dokument
Erweiterungen → Apps Script
Fügen Sie die Dateien aus diesem Projekt ein:
Code.gs
Sidebar.html
appsscript.json

Projekt-Einstellungen → Script-Eigenschaften:
Fügen Sie OPENAI_API_KEY mit Ihrem gültigen OpenAI API-Key hinzu

Speichern & Bereitstellen → Neues Deployment → Art: Add-on
Dokument neu laden → Menü „ChatGPT Sidebar“ → „Sidebar öffnen“

Sicherheitshinweise

Der API-Key wird nur in den Script Properties gespeichert
Keine automatischen Dokumentänderungen
Jede Änderung erfordert einen expliziten Button-Klick
„Mit ganzem Dokument“ sendet den kompletten Text an OpenAI

Viel Erfolg!