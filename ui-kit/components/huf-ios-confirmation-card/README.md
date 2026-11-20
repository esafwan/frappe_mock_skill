# Approval card (WhatsApp campaign): pending / sending / approved / denied  `huf-ios-confirmation-card`

Inline confirm-before-send card with key/value rows, sample message, expiry and Deny / Approve.

**When to use:** Use when an agent needs approval before an action.

**Slots people usually change:** `sample` (text, e.g. "Hi Ahmed, your invoice INV-204"), `action` (text, e.g. "Send WhatsApp campaign"), `template` (text, e.g. "payment_reminder_v2"), `expires` (text, e.g. "Expires in 8:55"), `recipients_label` (text, e.g. "Recipients"), `state_sending` (text, e.g. "Sending…"). All 15 slots are in `slots.json`.

**States:** default (none), active (props), sending (props), loading (props), approved (props), denied (props), error (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-confirmation-card"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-confirmation-card.deny`, `huf-ios-confirmation-card.approve`).

**Render:** `node tools/render.mjs huf-ios-confirmation-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
