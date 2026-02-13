# DB Widget Design System – Style Rules

> Reference file for AI agents to reproduce the SSC AZM widget design system.
> All widgets use pure HTML/CSS/JS – no frameworks, no build tools, no external dependencies.

---

## 1. Architecture

Each widget is a **single self-contained HTML file** designed to run inside an `<iframe>`.
Configuration happens exclusively through URL parameters (`?key=value&key2=value2`).
Complex data (e.g. menu structures) is passed as **Base64-encoded JSON** via `?json=eyJ...`.

### UTF-8 Safe Base64

```javascript
// ENCODE (in configurator / hub):
function b64encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// DECODE (in widget):
function b64decode(str) {
    try { return decodeURIComponent(escape(atob(str))); }
    catch(e) { return atob(str); }
}
```

This is critical for emoji and Umlaute support.

---

## 2. Design Tokens

### Colors

```css
:root {
    /* Primary */
    --red: #ec0016;                     /* DB Rot – accent, hover, active states */
    --red-hover: #b80012;               /* darker red for press states */
    --red-light: rgba(236, 0, 22, .08); /* tinted backgrounds */

    /* Neutral */
    --bg: #ffffff;                       /* widget background */
    --bg-hover: #f6f7f9;                /* hover state background */
    --bg-active: #eef0f3;               /* active/pressed background */
    --bg-page: #f5f5f7;                 /* page background (hub only) */

    /* Text hierarchy */
    --text: #1b1f24;                     /* primary text */
    --text2: #4b5563;                    /* secondary text, descriptions */
    --text3: #9ca3af;                    /* tertiary text, labels, hints */

    /* Structure */
    --border: #e5e7eb;                   /* borders, dividers */
    --focus: #3b82f6;                    /* keyboard focus ring (blue) */

    /* Blue accent (used sparingly for info/links) */
    --blue: #0ea5e9;
}
```

### Dark Theme Override

```css
body.dark {
    --bg: #1a1a2e;
    --bg-hover: rgba(255, 255, 255, .05);
    --bg-active: rgba(255, 255, 255, .08);
    --text: #f0f0f0;
    --text2: rgba(255, 255, 255, .65);
    --text3: rgba(255, 255, 255, .3);
    --border: rgba(255, 255, 255, .08);
    background: #1a1a2e;
}
```

### Typography

```css
font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
-webkit-font-smoothing: antialiased;
```

| Role | Size | Weight | Color |
|------|------|--------|-------|
| Section header / uppercase label | 10-12px | 600-700 | `--text3` |
| Primary text / titles | 13-14px | 600 | `--text` |
| Body / links | 13px | 400 | `--text2` |
| Small hints | 11px | 400 | `--text3` |
| Hub section titles | 24px | 800 | `--text` |

Letter-spacing for uppercase labels: `1-1.5px`

### Spacing & Radius

```
Padding (standard):      12-16px
Padding (compact):       6-10px
Border radius (cards):   8px (--radius)
Border radius (small):   5-6px (--radius-sm)
Border radius (hub):     12-16px
```

### Transitions

```css
--transition: 150ms ease;               /* most interactions */
/* Chevron / accordion: */ 200ms cubic-bezier(.4, 0, .2, 1);
```

---

## 3. Widget HTML Template

```html
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Widget Name</title>
<style>
/* Design tokens (see above) */
/* Widget-specific styles */
</style>
</head>
<body>
<div id="root"></div>
<script>
const P = new URLSearchParams(location.search);
if (P.get('theme') === 'dark') document.body.classList.add('dark');

// Read params, render widget
</script>
</body>
</html>
```

Key rules:
- **No external CSS/JS** – everything inline in one file
- **No `<link>` or `<script src>`** – zero network requests beyond the HTML itself
- `* { margin:0; padding:0; box-sizing:border-box; }` always
- Background: `transparent` or `var(--bg)` depending on context
- Body: `overflow-y:auto; overflow-x:hidden; scrollbar-width:thin;`

---

## 4. Component Patterns

### Accordion (vertical menu / sections)

Uses **native `<details>/<summary>`** – zero JavaScript for expand/collapse.

```html
<details open>
    <summary>
        <span class="icon">🕐</span>
        <span class="label">Section Name</span>
        <svg class="chevron"><!-- right-pointing arrow --></svg>
    </summary>
    <div class="links">
        <a class="link" href="..." target="_blank" rel="noopener">Link Text</a>
    </div>
</details>
```

Chevron behavior:
- Vertical: points right → rotates 90° on open
- Use `transform: rotate(90deg)` on `details[open] .chevron`
- SVG chevron preferred over CSS `::after` pseudo-element (better rendering)

```html
<svg class="chevron" viewBox="0 0 16 16" fill="none">
    <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Hover States

```css
/* Links */
.link:hover {
    color: var(--red);
    background: var(--bg-hover);
}
/* Sidebar links: add left accent border */
.link:hover {
    border-left: 2px solid var(--red);
}
```

### Focus States

```css
:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: -2px;
}
```

---

## 5. Menu Widget – Layout Modes

### Vertical (Sidebar Style)
Inspired by: Microsoft SharePoint navigation, SAP Fiori side panel

- Sections as `<details>/<summary>` accordions
- Links indented under sections
- Left accent border on hover
- Optional title header (uppercase, small)

### Horizontal (Dropdown Tabbar Style)
Inspired by: Microsoft 365 app bar, SAP Fiori Shell

- **Tabbar with dropdown panels** – sections as horizontal tabs, click to expand dropdown
- Uses `<details>/<summary>` like vertical, but tabs are flex-row, panels are absolute-positioned
- Only one dropdown open at a time (JS: close others on toggle)
- Click outside closes all dropdowns
- Tabs show red bottom-border accent when active

```css
.menu-h .tab-bar { display:flex; border-bottom:1px solid var(--border); }
.menu-h .section { flex:1; position:relative; }
.menu-h .links {
    position:absolute; top:100%; left:0; right:0;
    background:var(--bg); border:1px solid var(--border);
    border-radius:0 0 8px 8px;
    box-shadow:0 8px 24px rgba(0,0,0,.08);
    padding:8px 0; z-index:10;
}
```

---

## 6. Widget Hub (Configurator)

### Structure
- Sticky header: `background:var(--text); height:56px;` with DB logo box
- Sticky nav tabs below header
- Overlay panel for widget configuration
- Grid of widget cards with iframe previews

### Card Design
```css
.card {
    background: var(--card);
    border-radius: 12px;
    border: 1px solid var(--border);
    overflow: hidden;
    transition: box-shadow .2s, transform .2s;
}
.card:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,.08);
    transform: translateY(-2px);
}
```

### Overlay Panel
```css
.overlay {
    background: rgba(0,0,0,.5);
    backdrop-filter: blur(4px);
}
.panel {
    border-radius: 16px;
    max-width: 920px;
    max-height: calc(100vh - 80px);
}
```

### Live Preview Behavior
- **Dropdowns**: update preview immediately on `change` event
- **Text inputs**: update on `Enter` key press
- **Datetime inputs**: update on `change` event
- **Menu editor**: debounced update (300ms) on any change
- **No preview button** – all changes are reflected live
- Embed code auto-updates with preview

### Toast Notifications
```css
.toast {
    position: fixed; bottom: 24px; left: 50%;
    transform: translateX(-50%) translateY(80px); /* hidden */
    background: var(--text); color: #fff;
    padding: 10px 24px; border-radius: 10px;
    transition: transform .3s ease;
}
.toast.show { transform: translateX(-50%) translateY(0); }
```

---

## 7. Configuration System

### Standard Parameters (all widgets)
| Param | Values | Default | Description |
|-------|--------|---------|-------------|
| `theme` | `light`, `dark` | `light` | Color theme |

### Calendar-specific Parameters
| Param | Values | Default |
|-------|--------|---------|
| `bl` | `BW`,`BY`,`BE`,`BB`,`HB`,`HH`,`HE`,`MV`,`NI`,`NW`,`RP`,`SL`,`SN`,`ST`,`SH`,`TH` | `SL` |
| `kw` | `true`, `false` | `true` |

Feiertage are **calculated locally** in JavaScript using the Gauss Easter algorithm,
with per-Bundesland rules for regional holidays (Fronleichnam, Allerheiligen, etc.).
Schulferien are fetched from `openholidaysapi.org` API with graceful fallback.

### Countdown-specific Parameters
| Param | Values | Default |
|-------|--------|---------|
| `title` | any string | `Countdown` |
| `target` | ISO datetime | `2026-02-28T23:59` |
| `compact` | `false`, `true` | `false` |
| `done` | any string | `Abgeschlossen` |

No start date – progress always calculates from current moment to target.

### Menu-specific Parameters
| Param | Values | Default |
|-------|--------|---------|
| `layout` | `vertical`, `horizontal` | `vertical` |
| `variant` | (empty), `card` | (empty) |
| `compact` | `false`, `true` | `false` |
| `open` | `first`, `all`, `none` | `first` |
| `target` | `_blank`, `_parent`, `_top` | `_blank` |
| `json` | Base64 JSON string | – |

### Menu JSON Schema
```json
{
    "title": "Optional title (vertical only)",
    "sections": [
        {
            "label": "Section Name",
            "icon": "🕐",
            "links": [
                { "text": "Link Text", "url": "https://..." }
            ]
        }
    ]
}
```

### Ticker JSON Schema
```json
{
    "items": [
        { "badge": "wichtig", "text": "Nachrichtentext" },
        { "badge": "info", "text": "Zweite Meldung" }
    ]
}
```
Badge values: `wichtig`, `info`, `erfolg`, `termin`, `hinweis`, or empty string for dot-only.

### Compact URL Format (alternative to JSON, menu only)
```
?items=Section1::Link1|URL1,,Link2|URL2;;Section2::Link3|URL3
&icons=🕐,💰
```
Separators: `;;` sections, `::` label/links, `,,` links, `|` text/url

### Compact URL Format (ticker fallback)
```
?items=Badge|Text;;Badge|Text
```
The ticker also supports `?json=` with Base64-encoded JSON (preferred for the configurator).

---

## 8. Performance Guidelines

- **No frameworks** – each iframe is a separate runtime
- Target: < 15KB per widget (HTML + CSS + JS combined)
- No images – use SVG inline or emoji for icons
- No external fonts – rely on system font stack
- CSS shared across widgets via browser cache (same origin)
- Prefer CSS-only solutions (details/summary, transitions, :hover)
- JavaScript only for: URL param parsing, dynamic rendering, timers

---

## 9. Export/Import System

The hub supports exporting/importing widget configurations as JSON files.

### Export Format
```json
{
    "theme": "dark",
    "layout": "horizontal",
    "menuData": {
        "sections": [...]
    }
}
```

Only non-default parameter values are included. The `menuData` key is present only for the menu widget.

### Import Flow
1. User clicks "Import" → file picker opens
2. JSON file is read and parsed
3. Form fields are populated with values from the file
4. `menuData` (if present) replaces the editor state
5. Preview and embed code auto-update

---

## 10. Coding Style

- CSS: shorthand properties where possible, minified-ish but readable
- JS: `const` preferred, template literals for HTML, minimal DOM manipulation
- HTML: semantic elements (`<nav>`, `<details>`, `<summary>`)
- No classes with generic names – prefix with widget context (e.g. `menu-v`, `db-menu`)
- Consistent variable naming: `P` for URLSearchParams, `w` for widget config

---

## 11. Checklist for New Widgets

1. Create `widget-name/index.html` as single self-contained file
2. Include design tokens in `:root`
3. Support `?theme=dark` parameter minimum
4. Add to `widgets` array in hub `index.html`
5. Add preview card + panel config
6. Test in iframe context (transparent background, scrollbar)
7. Target: < 15KB file size
