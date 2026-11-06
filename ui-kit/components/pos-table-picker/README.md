# Table picker grid (available / occupied tables)  `pos-table-picker`

POS table picker.

**When to use:** Use at order start (dine-in).

**Slots people usually change:** `justify_between_2` (time, e.g. "12:10"), `text_gray_900_6` (text, e.g. "Takeaway Table 2"), `text_gray_900_7` (text, e.g. "Waiting Table"), `font_medium_2` (text, e.g. "Started at:"), `font_medium_5` (text, e.g. "Started at:"), `font_medium_8` (text, e.g. "Started at:"). All 73 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-table-picker"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `pos-table-picker.div-1`, `pos-table-picker.button-2`, `pos-table-picker.button-3`).

**Render:** `node tools/render.mjs pos-table-picker --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
