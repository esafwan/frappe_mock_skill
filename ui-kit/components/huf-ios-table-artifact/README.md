# Markdown table in a chat answer  `huf-ios-table-artifact`

Bordered table with header row and striped rows.

**When to use:** Use for structured answers.

**Slots people usually change:** `a2` (text, e.g. "AED 412,900 open"), `b2` (text, e.g. "94% available"), `h2` (text, e.g. "Live signal"), `b3` (text, e.g. "Operations"), `b1` (text, e.g. "Inventory"), `a3` (text, e.g. "Revenue"). All 9 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-table-artifact"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-table-artifact --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
