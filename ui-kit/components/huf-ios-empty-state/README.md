# Empty chat state: Start a conversation  `huf-ios-empty-state`

Empty chat state: Start a conversation

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `title` (text, e.g. "Start a conversation"), `subtitle` (text, e.g. "Falcon Arabic Test"). All 2 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-empty-state"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-empty-state --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
