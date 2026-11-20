# Attach sheet: Camera, Photo library, Files, Record audio  `huf-ios-sheet-attach`

Floating bottom sheet listing the attach sources.

**When to use:** Use when the + button is tapped.

**Slots people usually change:** `photo` (text, e.g. "Photo library"), `audio` (text, e.g. "Record audio"), `title` (text, e.g. "Attach"), `camera` (text, e.g. "Camera"), `files` (text, e.g. "Files"). All 5 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-sheet-attach"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-sheet-attach --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
