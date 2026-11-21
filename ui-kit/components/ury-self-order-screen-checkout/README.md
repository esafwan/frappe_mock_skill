# Self-order mobile checkout screen  `ury-self-order-screen-checkout`

Checkout: header ("← Back to cart", "Checkout"), Order Summary card with item rows and total, Payment Method card (Pay Online / Pay at Counter selected / Request Bill; selected = border-primary bg-primary/10) and a full-width "Place Order" button.

**When to use:** Final step before the order is sent. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `l1_amount` (currency, e.g. "AED 12.00"), `l2_amount` (currency, e.g. "AED 36.00"), `l3_amount` (currency, e.g. "AED 20.00"), `total` (currency, e.g. "AED 68.00"), `info` (text, e.g. "Payment request created (68.00"), `paying` (text, e.g. "Starting payment…"). All 22 slots are in `slots.json`.

**States:** default (none), payment-request-info (props), submitting (props), pay-online (props), starting-payment (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-screen-checkout"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-screen-checkout.cta`).

**Render:** `node tools/render.mjs ury-self-order-screen-checkout --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css, ury-v16/components/self-order-mobile.css from `tokens/css/` and the desk icon sprite (inlined in preview).
