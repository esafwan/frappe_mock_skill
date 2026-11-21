# Self-order mobile product detail screen  `ury-self-order-screen-detail`

Product detail: "Back" underlined link, full-width image, p-6 gap-4 body with h1 (text-xl semibold), muted description, price (text-lg medium), Variants and Add-ons option rows, 36px round quantity steppers and a rounded-full "Add to cart" button.

**When to use:** Opened when a menu card is tapped and product_detail_enabled is set. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `rate` (currency, e.g. "AED 18.00"), `v1_rate` (currency, e.g. "AED 18.00"), `v2_rate` (currency, e.g. "AED 22.00"), `a1_rate` (currency, e.g. "AED 4.00"), `a2_rate` (currency, e.g. "AED 3.00"). All 20 slots are in `slots.json`.

**States:** default (none), loading (props), not-found (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-screen-detail"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-screen-detail.back`, `ury-self-order-option-row.row`, `ury-self-order-option-row.row`).

**Render:** `node tools/render.mjs ury-self-order-screen-detail --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css, ury-v16/components/self-order-mobile.css from `tokens/css/` and the desk icon sprite (inlined in preview).
