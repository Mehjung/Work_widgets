# 🧩 DB Widget Hub – SSC AZM

Self-hosted iframe Widgets für das Deutsche Bahn Intranet.  
Gehostet auf GitHub Pages, konfigurierbar über URL-Parameter.

## 🚀 Live Demo

👉 **[Widget Hub öffnen](https://DEIN-USERNAME.github.io/db-widgets/)**

## 📦 Widgets

| Widget | Pfad | Beschreibung |
|--------|------|-------------|
| 🕐 Uhr | `/clock/` | Analog + Digital mit Datum |
| ⏳ Countdown | `/countdown/` | Timer mit Fortschrittsbalken |
| 📅 Kalender | `/calendar/` | Monatsansicht mit KW + Markierungen |
| 💬 Zitat | `/quote/` | Tägliche Motivationszitate (20+) |
| 📊 KPI | `/kpi/` | Kennzahl als Ring oder Balken |
| 📢 Ticker | `/ticker/` | Scrollendes Nachrichten-Laufband |
| 👥 Teamstatus | `/team-status/` | Verfügbarkeitsübersicht |

## 🔧 Einbettung

```html
<iframe 
  src="https://DEIN-USERNAME.github.io/db-widgets/clock/?theme=dark&mode=digital" 
  width="100%" height="250" frameborder="0"
  style="border:none; border-radius:12px;">
</iframe>
```

### Mit Klick-Blockade (empfohlen für Intranet)

```html
<div style="position:relative">
  <iframe src="https://..." width="100%" height="250" frameborder="0"></iframe>
  <div style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:10"></div>
</div>
```

## ⚙️ Konfiguration

Alle Widgets werden über **URL-Parameter** konfiguriert.  
Öffne den **Widget Hub** (`index.html`) für eine visuelle Konfiguration mit Live-Vorschau.

## 📂 Projektstruktur

```
db-widgets/
├── index.html          ← Widget Hub (Verwaltung)
├── README.md
├── clock/index.html
├── countdown/index.html
├── calendar/index.html
├── quote/index.html
├── kpi/index.html
├── ticker/index.html
└── team-status/index.html
```

## 🌐 GitHub Pages einrichten

1. Repository erstellen: `db-widgets`
2. Alle Dateien pushen
3. Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`
4. Fertig! Erreichbar unter `https://DEIN-USERNAME.github.io/db-widgets/`

## 📝 Eigene Widgets hinzufügen

1. Neuen Ordner erstellen: `mein-widget/index.html`
2. Widget als eigenständige HTML-Datei mit inline CSS + JS
3. URL-Parameter über `new URLSearchParams(location.search)` auslesen
4. Im Widget Hub (`index.html`) die `widgets`-Array ergänzen
