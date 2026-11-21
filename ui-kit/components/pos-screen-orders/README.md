# POS orders screen  `pos-screen-orders`

Orders route at 1440x900: header, 256px status sidebar (Draft active), 3-column card grid with Previous / Page / Next, and the empty 384px detail panel ("Select an order to view details").

**When to use:** Nothing selected yet.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `c2_total` (currency, e.g. "AED 132.25"), `c4_total` (currency, e.g. "AED 210.00"), `c6_total` (currency, e.g. "AED 186.25"), `c1_total` (currency, e.g. "AED 86.50"), `c3_total` (currency, e.g. "AED 54.00"). All 58 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-orders"`; 8 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-orders-sidebar.draft`).

**Render:** `node tools/render.mjs pos-screen-orders --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-orders.css from `tokens/css/` and the desk icon sprite (inlined in preview).
