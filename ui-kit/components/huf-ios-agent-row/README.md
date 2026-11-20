# Agent row: initials, name, provider and model, chat glyph  `huf-ios-agent-row`

Row of the Agents tab.

**When to use:** Use in the Agents list.

**Slots people usually change:** `detail` (text, e.g. "local · falcon-h1r:7b"), `name` (text, e.g. "Falcon Arabic Test"). All 2 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-agent-row"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-agent-row --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
