# Sheet navigation bar: Done, inline title, optional menu  `huf-ios-sheet-nav`

Navigation bar of the Artifacts sheet and the artifact detail sheet.

**When to use:** Use at the top of a full-height sheet; add the menu for the detail view.

**Slots people usually change:** `sheet_title` (text, e.g. "Artifacts"), `done` (text, e.g. "Done"). All 2 slots are in `slots.json`.

**States:** default (none), active (props), menu (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-sheet-nav"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-sheet-nav.done`).

**Render:** `node tools/render.mjs huf-ios-sheet-nav --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
