# Screen: chat with the agent switcher sheet open  `huf-ios-screen-agent-switcher`

Full iPhone screen: chat with the agent switcher sheet open

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/agent-switcher.light.png.

**Slots people usually change:** `assistant_text` (text, e.g. "Three invoices are open, total"), `user_text` (text, e.g. "Which orders from Gulf Steel a"), `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"), `draft` (text, e.g. "Summarize the overdue invoices"), `d3` (text, e.g. "Google · gemini-3.5-flash-lite"), `d2` (text, e.g. "Anthropic · claude-sonnet-4.6"). All 15 slots are in `slots.json`.

**States:** default (none), closed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-agent-switcher"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-composer.attach`).

**Render:** `node tools/render.mjs huf-ios-screen-agent-switcher --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
