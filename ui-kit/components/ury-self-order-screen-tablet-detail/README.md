# Self-order tablet product detail screen  `ury-self-order-screen-tablet-detail`

TabletLayout with screen === "detail": ProductDetail replaces the menu grid inside the 68% main pane (the header and the 32% CartPanel stay): Back link, full-width image, name 20/600, description, rate 18/500, Variants and Add-ons option rows, round -/+ quantity stepper and a full-width rounded-full "Add to cart" button.

**When to use:** Opened when product_detail_enabled is set and a card is tapped. The detail image is a wide sample photo (the source image keeps its natural aspect ratio). RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `detail_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `rate` (currency, e.g. "AED 20.00"), `v1_rate` (currency, e.g. "AED 20.00"), `v2_rate` (currency, e.g. "AED 24.00"), `c1_amount` (currency, e.g. "AED 20.00"), `c2_amount` (currency, e.g. "AED 28.00"). All 30 slots are in `slots.json`.

**States:** default (none), nothing-selected (props), no-options (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-screen-tablet-detail"`; 8 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-screen-tablet-detail.new-order`, `ury-self-order-screen-tablet-detail.back`, `ury-self-order-screen-tablet-detail.vrow-1`).

**Render:** `node tools/render.mjs ury-self-order-screen-tablet-detail --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css, ury-v16/components/self-order-tablet.css from `tokens/css/` and the desk icon sprite (inlined in preview).
