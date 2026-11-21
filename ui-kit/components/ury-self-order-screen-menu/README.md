# Self-order mobile menu screen  `ury-self-order-screen-menu`

MobileQR menu at 390x844: sticky blurred header ("Table 5" 18/600, "Start Over" border button), "Your order so far" card with Total row, category chips, search, 2-column product grid (gap 12) and a fixed bottom bar with "View Cart (3 items) • total" (rounded-md bg-primary py-3).

**When to use:** Use as the first screen after scanning a table QR code. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `p4_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `p1_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `p3_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `p2_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `o1_amount` (currency, e.g. "AED 12.00"), `o2_amount` (currency, e.g. "AED 36.00"). All 46 slots are in `slots.json`.

**States:** default (none), pickup (props), missing-token (props), starting-up (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-screen-menu"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-category-tabs.all`, `ury-self-order-category-tabs.chip-1`, `ury-self-order-category-tabs.chip-2`).

**Render:** `node tools/render.mjs ury-self-order-screen-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css, ury-v16/components/self-order-mobile.css from `tokens/css/` and the desk icon sprite (inlined in preview).
