# Pinned chat row (teal pin beside the date)  `huf-ios-pinned-chat-row`

Pinned chat row (teal pin beside the date)

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `title` (text, e.g. "Gulf Steel receivables"), `agent` (text, e.g. "Finance Reviewer"), `date` (text, e.g. "AUG 13"). All 3 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-pinned-chat-row"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-pinned-chat-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
