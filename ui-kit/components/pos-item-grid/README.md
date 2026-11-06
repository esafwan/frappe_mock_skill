# Menu item grid  `pos-item-grid`

POS item grid of cards.

**When to use:** Use for the POS ordering screen; bind to data/menus for any cuisine.

**Slots people usually change:** `text_gray_900_4` (currency, e.g. "₹ 240"), `text_gray_900_6` (currency, e.g. "₹ 290"), `text_gray_900_8` (currency, e.g. "₹ 180"), `text_gray_900_10` (currency, e.g. "₹ 290"), `text_gray_900_12` (currency, e.g. "₹ 150"), `text_gray_900_14` (currency, e.g. "₹ 190"). All 90 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-item-grid"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `pos-item-grid.div-1`, `pos-item-grid.div-2`, `pos-item-grid.div-3`).

**Render:** `node tools/render.mjs pos-item-grid --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
