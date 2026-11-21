# Self-order mobile cart screen  `ury-self-order-screen-cart`

Full-screen cart: header with "← Back to menu", centred "Your Cart" and a w-[92px] spacer; rounded-lg line cards with 28px −/+ steppers and an optional "Note:" line; footer with item count, total and "Proceed to checkout".

**When to use:** Reached from the fixed "View Cart" bar. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `total` (currency, e.g. "AED 48.00"), `zero_total` (currency, e.g. "AED 0.00"), `checkout` (text, e.g. "Proceed to checkout"), `empty` (text, e.g. "Your cart is empty."), `browse` (text, e.g. "Browse the menu"), `back` (text, e.g. "← Back to menu"). All 15 slots are in `slots.json`.

**States:** default (none), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-screen-cart"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-self-order-screen-cart --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css, ury-v16/components/self-order-mobile.css from `tokens/css/` and the desk icon sprite (inlined in preview).
