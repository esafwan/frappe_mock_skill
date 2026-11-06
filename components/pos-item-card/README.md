# Menu item card  `pos-item-card`

A single POS item card (photo, name, price).

**When to use:** Use for close-ups; bind to a menu item.

**Slots people usually change:** `text_gray_900_2` (currency, e.g. "₹ 60"), `text_gray_900` (text, e.g. "Butter Naan"), `font_normal` (text, e.g. "Available"), `text_gray_500` (text, e.g. "Breads"). All 8 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-item-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-item-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
