# Mosaic Production Card  `ury-mosaic-production-card`

Production dashboard tile: empty 40px --ac-t tile, unit name, three stat tiles in Geist Mono, "Click to view KOTs" footer.

**When to use:** Production dashboard grid; one per production unit; click opens that unit's KOT board. "Main Kitchen" Arabic name is sample data. Modes: light and rtl only; dark is not applicable (mosaic/src/index.css defines one light palette (:root only) and no dark: classes or .dark overrides, so the KDS has no dark theme).

**Slots people usually change:** `prod_foot` (text, e.g. "Click to view KOTs"), `prod_unit` (text, e.g. "Production Unit"), `prod_title` (text, e.g. "Main Kitchen"), `l_active` (text, e.g. "Active"), `l_served` (text, e.g. "Served"), `l_total` (text, e.g. "Total"). All 9 slots are in `slots.json`.

**States:** default (props), disabled (props), idle (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-production-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-mosaic-production-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css from `tokens/css/` and the desk icon sprite (inlined in preview).
