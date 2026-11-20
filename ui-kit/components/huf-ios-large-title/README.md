# Large title with search field (Chats, Projects, Agents)  `huf-ios-large-title`

Large title with search field (Chats, Projects, Agents)

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `search_placeholder` (text, e.g. "Search chats"), `title` (text, e.g. "Chats"). All 2 slots are in `slots.json`.

**States:** default (none), projects (props), agents (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-large-title"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-large-title.compose`).

**Render:** `node tools/render.mjs huf-ios-large-title --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
