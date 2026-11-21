# Portrait kiosk product detail  `ury-kiosk-screen-portrait-detail`

Full-screen product detail (product_detail_enabled): the layout header, then ProductDetail: underlined Back, full-width image, h1 20/600 name, muted description, 18/500 rate, Variants and Add-ons option rows, a 36 px round quantity stepper and the full-pill Add to cart button.

**When to use:** Use when a card is tapped and product detail is on. Image height follows the source (natural aspect, w-full). RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels (self-order has no locale file).

**Slots people usually change:** `img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `cart_total` (currency, e.g. "AED 57.00"), `d_rate` (currency, e.g. "AED 16.00"), `v1_rate` (currency, e.g. "AED 16.00"), `v2_rate` (currency, e.g. "AED 20.00"), `r0` (currency, e.g. "AED 12.00"). All 65 slots are in `slots.json`.

**States:** default (none), addon-selected (props), no-options (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-portrait-detail"`; 7 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-portrait-detail.new-order`, `ury-kiosk-screen-portrait-detail.back`, `ury-kiosk-screen-portrait-detail.v1`).

**Render:** `node tools/render.mjs ury-kiosk-screen-portrait-detail --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-portrait.css from `tokens/css/` and the desk icon sprite (inlined in preview).
