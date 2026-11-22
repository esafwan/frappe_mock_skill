# Screen: approval request in chat (pending; sending / approved / denied variants)  `huf-ios-screen-approval`

Full iPhone screen: approval request in chat (pending; sending / approved / denied variants)

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/approval.light.png.

**Slots people usually change:** `assistant_text` (text, e.g. "Three invoices are open, total"), `sample` (text, e.g. "Hi Ahmed, your invoice INV-204"), `user_text` (text, e.g. "Which orders from Gulf Steel a"), `ap_user` (text, e.g. "Send the payment reminder to o"), `ap_assist` (text, e.g. "I prepared a reminder. Approve"), `subtitle` (text, e.g. "Falcon Arabic Test · falcon-h1"). All 25 slots are in `slots.json`.

**States:** default (none), sending (props), loading (props), approved (props), denied (props), error (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-approval"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-nav-header.back`, `huf-ios-nav-header.menu`, `huf-ios-confirmation-card.deny`).

**Render:** `node tools/render.mjs huf-ios-screen-approval --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
