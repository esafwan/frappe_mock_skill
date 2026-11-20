# Chart artifact card (bar chart, CHART badge)  `huf-ios-chart-artifact-card`

Artifact card with a CHART badge and a native bar chart: grid lines, value labels, category labels.

**When to use:** Use for chart answers; values are fixed geometry, text is slot-driven.

**Slots people usually change:** `title` (text, e.g. "Open receivables"), `c3` (text, e.g. "Delta Foods"), `c1` (text, e.g. "Gulf Steel"), `c5` (text, e.g. "Marina Ltd"), `c4` (text, e.g. "Sahara Co"), `c2` (text, e.g. "Al Noor"). All 12 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-chart-artifact-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-chart-artifact-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
