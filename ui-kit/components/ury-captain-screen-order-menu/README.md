# URY Captain screen: Order, Menu tab  `ury-captain-screen-order-menu`

Captain order screen on a phone with the Menu pane active: header (back, "Table T4" over "Updating order", Menu | Order pill toggle with blue count badge, kebab), the touch menu browser and the sticky send bar.

**When to use:** Opened from a table card to add items. The Order toggle switches to the order-list screen; below the lg breakpoint only one pane shows. Update Order is hard-coded English in the source.

**Slots people usually change:** `image_4` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_2` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_3` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_1` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `price_1` (currency, e.g. "AED 22.00"), `price_2` (currency, e.g. "AED 24.00"). All 35 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-screen-order-menu"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-screen-order-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css, ury-v16/components/captain-screens.css from `tokens/css/` and the desk icon sprite (inlined in preview).
