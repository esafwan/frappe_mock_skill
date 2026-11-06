# Order status filter chips  `pos-order-status-chips`

Order status chips.

**When to use:** Use to show Preparing/Ready/Served states.

**Slots people usually change:** `ms_1_3` (text, e.g. "Recently Paid"), `tracking_wide` (text, e.g. "Order Status"), `ms_1_2` (text, e.g. "Unbilled"), `ms_1` (text, e.g. "Draft"). All 4 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-order-status-chips"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `pos-order-status-chips.button-1`, `pos-order-status-chips.button-2`, `pos-order-status-chips.button-3`).

**Render:** `node tools/render.mjs pos-order-status-chips --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
