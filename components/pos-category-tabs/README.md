# Menu category tabs (pills)  `pos-category-tabs`

POS category tab strip.

**When to use:** Use above the item grid; bind to menu categories.

**Slots people usually change:** `hover_bg_gray_200` (text, e.g. "Special Items"), `text_blue_700` (text, e.g. "All"). All 2 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-category-tabs"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `pos-category-tabs.all`, `pos-category-tabs.special`).

**Render:** `node tools/render.mjs pos-category-tabs --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
