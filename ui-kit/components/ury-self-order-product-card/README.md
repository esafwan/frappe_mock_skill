# Self-order product card  `ury-self-order-product-card`

Menu item button: bordered card with image (h-24 mobile, h-32 tablet, h-40 landscape, h-48 portrait), name (font-medium), rate (muted) and an "In cart: N" primary badge; rounded-lg on mobile, xl/2xl on kiosks. Unavailable items are opacity-50 with a destructive reason in place of the badge.

**When to use:** Use inside the menu grid. Currency is a typed slot: the source prints the raw server string, the kit uses a formatted currency. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `rate` (currency, e.g. "AED 12.00"), `in_cart` (text, e.g. "In cart: 2"), `name` (text, e.g. "Espresso"), `unavail` (text, e.g. "Sold out"). All 5 slots are in `slots.json`.

**States:** default (none), tablet (props), landscape (props), portrait (props), not-in-cart (props), sold-out (props), not-available-today (props), temporarily-unavailable (props), currently-unavailable (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-product-card"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-product-card.card`).

**Render:** `node tools/render.mjs ury-self-order-product-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css from `tokens/css/` and the desk icon sprite (inlined in preview).
