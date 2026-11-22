# Assistant reply text (plain, loading spinner, note)  `huf-ios-assistant-text`

Assistant answer, full width without a bubble.

**When to use:** Use for answers; add the spinner while streaming.

**Slots people usually change:** `text` (text, e.g. "Three invoices are open, total"), `note` (text, e.g. "Choose another agent to start "). All 2 slots are in `slots.json`.

**States:** default (none), loading (props), unavailable (props), error (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-assistant-text"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-assistant-text --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
