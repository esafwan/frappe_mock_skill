# Screen: artifact detail sheet (chart preview with data table; html / diagram / source variants)  `huf-ios-screen-artifact-detail`

Full iPhone screen: artifact detail sheet (chart preview with data table; html / diagram / source variants)

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/artifact-detail.light.png.

**Slots people usually change:** `source` (text, e.g. "<h1&gt;Receivables</h1&gt;
<p&"), `assistant_text` (text, e.g. "Three invoices are open, total"), `user_text` (text, e.g. "Which orders from Gulf Steel a"), `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"), `draft` (text, e.g. "Summarize the overdue invoices"), `hp_sub` (text, e.g. "Open invoices by customer"). All 50 slots are in `slots.json`.

**States:** default (none), html (props), diagram (props), source (props), closed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-artifact-detail"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-sheet-nav.done`).

**Render:** `node tools/render.mjs huf-ios-screen-artifact-detail --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
