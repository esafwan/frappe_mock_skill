# Menu categories side panel (with item counts)  `pos-category-sidebar`

Menu categories side panel (with item counts)

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `text_center` (number, e.g. "202"), `text_center_2` (number, e.g. "27"), `text_center_3` (number, e.g. "17"), `text_center_5` (number, e.g. "11"), `text_center_6` (number, e.g. "12"), `text_center_8` (number, e.g. "16"). All 43 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-category-sidebar"`; 21 interactive elements with measured boxes in `measurements.json` (e.g. `pos-category-sidebar.button-1`, `pos-category-sidebar.button-2`, `pos-category-sidebar.button-3`).

**Render:** `node tools/render.mjs pos-category-sidebar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
