# Order cart (lines, totals, actions)  `pos-cart`

POS cart lines and totals.

**When to use:** Use for order building; change items, qty and totals.

**Slots people usually change:** `text_sm_2` (currency, e.g. "₹ 60"), `font_semibold_2` (currency, e.g. "₹ 60"), `w_full` (text, e.g. "Add New Order"), `hover_bg_gray_50_4` (text, e.g. "Aggregators"), `text_sm` (text, e.g. "Butter Naan"), `hover_text_gray_800` (text, e.g. "Clear cart"). All 21 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr), empty (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-cart"`; 15 interactive elements with measured boxes in `measurements.json` (e.g. `pos-cart.button-1`, `pos-cart.button-2`, `pos-cart.button-3`).

**Render:** `node tools/render.mjs pos-cart --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
