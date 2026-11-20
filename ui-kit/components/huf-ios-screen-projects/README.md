# Screen: Projects tab  `huf-ios-screen-projects`

Screen: Projects tab

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `pd0` (text, e.g. "0 agents · 0 loaded chats"), `pd` (text, e.g. "1 agent · 1 loaded chat"), `p2` (text, e.g. "Policy & compliance"), `p3` (text, e.g. "Vendor onboarding"), `search_placeholder` (text, e.g. "Search projects"), `p4` (text, e.g. "Field reports"). All 14 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-projects"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-large-title.add`, `huf-ios-large-title.calendar`, `huf-ios-tab-bar.chat`).

**Render:** `node tools/render.mjs huf-ios-screen-projects --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
