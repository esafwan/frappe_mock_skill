# Project row: folder tile, name, counts, chevron  `huf-ios-project-row`

Row of the Projects list.

**When to use:** Use under the Projects section label.

**Slots people usually change:** `detail` (text, e.g. "1 agent · 1 loaded chat"), `name` (text, e.g. "Receivables"). All 2 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-project-row"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-project-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
