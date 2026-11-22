# Mermaid diagram in the artifact detail view  `huf-ios-diagram-detail`

The same ERP flow diagram, un-carded, for the full-screen artifact view.

**When to use:** Use inside the artifact detail sheet.

**Slots people usually change:** `title` (text, e.g. "ERP architecture"), `n4` (text, e.g. "ERP database"), `n1` (text, e.g. "Sales & CRM"), `n3` (text, e.g. "Inventory"), `n5` (text, e.g. "Analytics"), `badge` (text, e.g. "MERMAID"). All 7 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-diagram-detail"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-diagram-detail --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
