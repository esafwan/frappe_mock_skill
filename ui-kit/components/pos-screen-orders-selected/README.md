# POS orders screen with a selected order  `pos-screen-orders-selected`

Orders route with a card selected (blue ring) and the 384px detail panel filled for that order.

**When to use:** After clicking an order.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `c2_total` (currency, e.g. "AED 132.25"), `c4_total` (currency, e.g. "AED 210.00"), `c6_total` (currency, e.g. "AED 186.25"), `total` (currency, e.g. "AED 132.25"), `c1_total` (currency, e.g. "AED 86.50"). All 83 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-orders-selected"`; 13 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-orders-sidebar.draft`).

**Render:** `node tools/render.mjs pos-screen-orders-selected --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-orders.css from `tokens/css/` and the desk icon sprite (inlined in preview).
