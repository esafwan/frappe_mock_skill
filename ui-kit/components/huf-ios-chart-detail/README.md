# Chart artifact detail: full chart plus Data table  `huf-ios-chart-detail`

Preview of a chart artifact in the full-screen view: larger chart and the underlying data table.

**When to use:** Use inside the artifact detail sheet.

**Slots people usually change:** `col_val` (text, e.g. "Open (AED k)"), `c3` (text, e.g. "Delta Foods"), `c1` (text, e.g. "Gulf Steel"), `c5` (text, e.g. "Marina Ltd"), `c4` (text, e.g. "Sahara Co"), `col_cat` (text, e.g. "Category"). All 18 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-chart-detail"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-chart-detail --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
