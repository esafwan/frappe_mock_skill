# Screen: Artifacts browser sheet (conversation artifacts list)  `huf-ios-screen-artifacts`

Full iPhone screen: Artifacts browser sheet (conversation artifacts list)

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/artifacts.light.png.

**Slots people usually change:** `assistant_text` (text, e.g. "Three invoices are open, total"), `user_text` (text, e.g. "Which orders from Gulf Steel a"), `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"), `draft` (text, e.g. "Summarize the overdue invoices"), `r1_title` (text, e.g. "Receivables dashboard"), `r4_title` (text, e.g. "Receivables summary"). All 16 slots are in `slots.json`.

**States:** default (none), loading (props), closed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-artifacts"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-sheet-nav.done`).

**Render:** `node tools/render.mjs huf-ios-screen-artifacts --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
