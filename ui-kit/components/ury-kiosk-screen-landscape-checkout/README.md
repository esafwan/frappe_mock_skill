# URY landscape kiosk checkout  `ury-kiosk-screen-landscape-checkout`

Checkout under the repeated kiosk header: "Order Summary" card with the lines, item count and total, a "Payment Method" card with full-width option buttons (Pay Online, Pay at Counter, Request Bill) and a full-width primary action.

**When to use:** The shared screen is not rescaled for the kiosk, so the cards span the whole 1920px width (mx-4). Which options appear depends on the capabilities. Fixed UI labels are author translations for RTL (the self-order app has no locale file) and NEED NATIVE REVIEW; RTL is a kit extension.

**Slots people usually change:** `l1_amount` (currency, e.g. "AED 16.00"), `l2_amount` (currency, e.g. "AED 32.00"), `cart_total` (currency, e.g. "AED 48.00"), `payment_note` (text, e.g. "Payment request created (48.00"), `bill_requested` (text, e.g. "Bill requested — staff notifie"), `starting` (text, e.g. "Starting payment…"). All 20 slots are in `slots.json`.

**States:** default (none), pay-online-selected (props), paying-online (props), bill-requested (props), payment-request (props), placing (props), counter-only (props), online-only (props), no-payment-options (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-landscape-checkout"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-landscape-checkout.new-order`, `ury-kiosk-screen-landscape-checkout.pm-online`, `ury-kiosk-screen-landscape-checkout.pm-counter`).

**Render:** `node tools/render.mjs ury-kiosk-screen-landscape-checkout --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-landscape.css from `tokens/css/` and the desk icon sprite (inlined in preview).
