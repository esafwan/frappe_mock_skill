# HTML artifact page: heading, KPI tiles and table  `huf-ios-html-page`

Rendered HTML dashboard as shown in the full-screen artifact view.

**When to use:** Use inside the artifact detail sheet.

**Slots people usually change:** `hp_sub` (text, e.g. "Open invoices by customer"), `b1` (text, e.g. "Al Noor Trading"), `h3` (text, e.g. "Days overdue"), `hp_title` (text, e.g. "Receivables"), `k1l` (text, e.g. "Open (AED)"), `h2` (text, e.g. "Open (AED)"). All 17 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-html-page"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-html-page --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
