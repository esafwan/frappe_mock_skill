# Chat nav header: back, title with mono agent subtitle and chevron, menu  `huf-ios-nav-header`

Navigation header of a chat thread: glass back button, centred title/subtitle (agent name and model in mono) with the agent-switch chevron, and the actions menu.

**When to use:** Use above any chat thread; change the subtitle to show Text only / Unavailable agent.

**Slots people usually change:** `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"), `title` (text, e.g. "Falcon Arabic Test"). All 2 slots are in `slots.json`.

**States:** default (none), active (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-nav-header"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`).

**Render:** `node tools/render.mjs huf-ios-nav-header --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
