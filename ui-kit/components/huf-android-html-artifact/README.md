# HTML artifact card (title, View source / Open full, sandboxed web preview dashboard)  `huf-android-html-artifact`

HTML artifact card (title, View source / Open full, sandboxed web preview dashboard)

**When to use:** Chat artifact for kind html: JS-off WebView preview of an HTML dashboard. Slots set the title and the KPI tiles; `source_label` toggles View source / View preview.

**Slots people usually change:** `title` (text, e.g. "Receivables dashboard"), `k3l` (text, e.g. "Reminders queued"), `k2l` (text, e.g. "Oldest invoice"), `k1l` (text, e.g. "Open balance"), `source_label` (text, e.g. "View source"), `k1` (text, e.g. "AED 713K"). All 8 slots are in `slots.json`.

**States:** default (none), source-shown (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-html-artifact"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-html-artifact --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
