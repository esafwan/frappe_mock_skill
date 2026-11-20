# Screen: chat thread with approval cards, markdown table and HTML dashboard  `huf-ios-screen-dashboard`

Full iPhone screen: chat thread with approval cards, markdown table and HTML dashboard

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/dashboard.light.png.

**Slots people usually change:** `assistant_text` (text, e.g. "Three invoices are open, total"), `sample` (text, e.g. "Hi Ahmed, your invoice INV-204"), `user_text` (text, e.g. "Which orders from Gulf Steel a"), `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"), `draft` (text, e.g. "Summarize the overdue invoices"), `card_sub` (text, e.g. "Open invoices by customer"). All 34 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-dashboard"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-confirmation-card.deny`).

**Render:** `node tools/render.mjs huf-ios-screen-dashboard --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
