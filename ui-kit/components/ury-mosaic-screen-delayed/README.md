# Mosaic Screen: Delayed Order  `ury-mosaic-screen-delayed`

mosaic KOT board while an order is overdue and the connection is lost.

**When to use:** Banner appears when a KOT passes kot_alert_time; the offline toast on connectivity loss. Modes: light and rtl only; dark is not applicable (mosaic defines one light palette).

**Slots people usually change:** `dup_note` (text, e.g. "Duplicate KOT ( CHECK WITH CAP"), `disp_done` (text, e.g. "Disposition: Returned to Stock"), `c_heading` (text, e.g. "Select Active Company"), `b_heading` (text, e.g. "Select Active Branch"), `switch_dashboard` (text, e.g. "Switch to Dashboard"), `type_label_8` (text, e.g. "Partially cancelled"). All 136 slots are in `slots.json`.

**States:** default (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-screen-delayed"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `ury-mosaic-header-refresh`, `ury-mosaic-header-user`).

**Render:** `node tools/render.mjs ury-mosaic-screen-delayed --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css, ury-v16/components/mosaic-screens.css from `tokens/css/` and the desk icon sprite (inlined in preview).
