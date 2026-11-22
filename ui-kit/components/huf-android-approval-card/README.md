# Approval (confirmation) card: Pending / Sending / Approved / Denied  `huf-android-approval-card`

Approval (confirmation) card: Pending / Sending / Approved / Denied

**When to use:** Confirmation card for approval-gated tool calls. Pass state class and the matching footer (`footer` slot).

**Slots people usually change:** `footer` (html, e.g. "<div class="acts"><div class=""), `title` (text, e.g. "Send WhatsApp broadcast"), `sample` (text, e.g. "Hi Asha, ..."), `template` (text, e.g. "promo_nov"), `channel` (text, e.g. "whatsapp"), `status` (text, e.g. "Pending"). All 8 slots are in `slots.json`.

**States:** default (none), active (props), sending (props), approved (props), pressed (props), denied (props), pending-expiring (props), disabled (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-approval-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-approval-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
