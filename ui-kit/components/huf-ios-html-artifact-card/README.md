# HTML artifact card (dashboard)  `huf-ios-html-artifact-card`

HTML artifact card (dashboard)

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `title` (text, e.g. "Receivables dashboard"), `heading` (text, e.g. "Receivables"), `badge` (text, e.g. "HTML"). All 3 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-html-artifact-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-html-artifact-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
