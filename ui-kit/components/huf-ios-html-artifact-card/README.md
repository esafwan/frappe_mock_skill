# HTML artifact card (dashboard)  `huf-ios-html-artifact-card`

Artifact card with an HTML badge and preview area.

**When to use:** Use for dashboards the agent built.

**Slots people usually change:** `subheading` (text, e.g. "Open invoices by customer"), `title` (text, e.g. "Receivables dashboard"), `heading` (text, e.g. "Receivables"), `badge` (text, e.g. "HTML"). All 4 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-html-artifact-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-html-artifact-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
