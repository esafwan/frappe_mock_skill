# Screen: chat with an unavailable agent  `huf-ios-screen-disabled-agent`

Full iPhone screen: chat with an unavailable agent

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/disabled-agent.light.png.

**Slots people usually change:** `assistant_text` (text, e.g. "Three invoices are open, total"), `user_text` (text, e.g. "Which orders from Gulf Steel a"), `note` (text, e.g. "Choose another agent to start "), `draft` (text, e.g. "Summarize the overdue invoices"), `placeholder` (text, e.g. "Choose an agent to chat"), `title` (text, e.g. "Falcon Arabic Test"). All 7 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-disabled-agent"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-composer.attach`).

**Render:** `node tools/render.mjs huf-ios-screen-disabled-agent --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
