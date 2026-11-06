# Order type tabs, search and category pills (filter bar)  `pos-filter-bar`

Order type tabs, search and category pills (filter bar)

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `hover_bg_gray_200` (text, e.g. "Special Items"), `text_blue_700` (text, e.g. "All"). All 2 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-filter-bar"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `pos-filter-bar.button-1`, `pos-filter-bar.button-2`).

**Render:** `node tools/render.mjs pos-filter-bar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
