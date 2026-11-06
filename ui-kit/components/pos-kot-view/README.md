# Kitchen / KOT production-unit overview (Mosaic)  `pos-kot-view`

Kitchen order ticket list.

**When to use:** Use for kitchen/KOT scenes.

**Slots people usually change:** `text_xs_5` (text, e.g. "Click to view KOTs"), `text_xs_10` (text, e.g. "Click to view KOTs"), `text_xs_15` (text, e.g. "Click to view KOTs"), `text_xs_20` (text, e.g. "Click to view KOTs"), `text_xs_25` (text, e.g. "Click to view KOTs"), `text_xs_30` (text, e.g. "Click to view KOTs"). All 81 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-kot-view"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-kot-view --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-mosaic.css from `tokens/css/` and the desk icon sprite (inlined in preview).
