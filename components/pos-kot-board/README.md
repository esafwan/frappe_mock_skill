# KOT board: live kitchen tickets for one production unit (Mosaic)  `pos-kot-board`

KOT board: live kitchen tickets for one production unit (Mosaic)

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `shrink_0` (time, e.g. "0:00"), `shrink_0_2` (time, e.g. "0:00"), `shrink_0_3` (time, e.g. "0:00"), `shrink_0_4` (time, e.g. "0:00"), `shrink_0_5` (time, e.g. "0:00"), `shrink_0_6` (time, e.g. "0:00"). All 72 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-kot-board"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-kot-board --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-mosaic.css from `tokens/css/` and the desk icon sprite (inlined in preview).
