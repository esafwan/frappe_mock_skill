# URY Captain order line  `ury-captain-order-line`

One row of the delta-aware order list: "<qty> x name", optional comment, line price and round 36px action buttons. delta (new/changed, blue) has Minus and Plus; reduction (pending reduction, red, struck through) has RotateCcw; confirmed (already ordered, white) has Minus and a red Trash2.

**When to use:** Captain order screen, Current Order list (366px wide at 390px).

**Slots people usually change:** `price` (currency, e.g. "AED 48.00"), `comment` (text, e.g. "No onions"), `item_name` (text, e.g. "Falafel"), `qty_label` (text, e.g. "+2"). All 4 slots are in `slots.json`.

**States:** default (none), delta (props), delta-no-comment (props), reduction (props), confirmed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-order-line"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-order-line --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css from `tokens/css/` and the desk icon sprite (inlined in preview).
