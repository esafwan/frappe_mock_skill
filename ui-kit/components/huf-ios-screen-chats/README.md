# Screen: Chat tab, conversation list  `huf-ios-screen-chats`

Full iPhone screen: Chat tab, conversation list

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/chats.light.png.

**Slots people usually change:** `t2` (text, e.g. "Gulf Steel receivables"), `t1` (text, e.g. "Falcon Arabic Test"), `a1` (text, e.g. "Falcon Arabic Test"), `t3` (text, e.g. "Q3 policy rewrite"), `a2` (text, e.g. "Finance Reviewer"), `a3` (text, e.g. "Hub Orchestrator"). All 16 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-chats"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-large-title.compose`, `huf-ios-tab-bar.chat`, `huf-ios-tab-bar.projects`).

**Render:** `node tools/render.mjs huf-ios-screen-chats --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
