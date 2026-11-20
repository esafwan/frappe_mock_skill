# Screen: chat with the attach sheet open  `huf-ios-screen-attach`

Full iPhone screen: chat with the attach sheet open

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/attach.light.png.

**Slots people usually change:** `assistant_text` (text, e.g. "Three invoices are open, total"), `user_text` (text, e.g. "Which orders from Gulf Steel a"), `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"), `draft` (text, e.g. "Summarize the overdue invoices"), `photo` (text, e.g. "Photo library"), `audio` (text, e.g. "Record audio"). All 10 slots are in `slots.json`.

**States:** default (none), closed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-attach"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-composer.attach`).

**Render:** `node tools/render.mjs huf-ios-screen-attach --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
