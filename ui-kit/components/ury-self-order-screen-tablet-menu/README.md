# Self-order tablet menu screen  `ury-self-order-screen-tablet-menu`

TabletLayout menu at 1280x800: header (px-6 py-4, border-b, H1 20/600 "Table T12", "New Order" button px-3 py-2 rounded-md border), then a split body: main pane 68% (p-6: category chips, search, 4-column grid gap-4 of cards min-w-150 rounded-xl with h-32 images) and the persistent CartPanel 32% (border-s, p-4).

**When to use:** Use for a tablet handed to a customer or fixed at a table. Base capture is the cart-filled state. Currency is a typed slot. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `m1_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `m8_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `m6_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `m7_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `m5_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `m3_img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"). All 49 slots are in `slots.json`.

**States:** default (none), empty-cart (props), cart-filled (props), idle-dialog (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-screen-tablet-menu"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-screen-tablet-menu.new-order`, `ury-self-order-category-tabs.all`, `ury-self-order-category-tabs.chip-1`).

**Render:** `node tools/render.mjs ury-self-order-screen-tablet-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css, ury-v16/components/self-order-tablet.css from `tokens/css/` and the desk icon sprite (inlined in preview).
