# POS service line panel  `pos-service-line`

The Service Line panel: Activity chip, title, a destructive "n over time" tag, five stage legend chips with live counts, and one bar per table (minutes above, table name below) with over-time bars in destructive red.

**When to use:** Operational heart of the Dashboard. Bar height is minutes against a 90 minute scale; tables with no timer show a 5% stub.

**Slots people usually change:** `sl_warn` (text, e.g. "2 tables running over time — c"), `sl_empty` (text, e.g. "No tables seated yet"), `sl_tracked` (text, e.g. "8 tables tracked"), `sl_title` (text, e.g. "Service Line"), `sl_over_label` (text, e.g. "over time"), `st_over` (text, e.g. "Over time"). All 33 slots are in `slots.json`.

**States:** default (none), no-over (props), loading (props), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-service-line"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-service-line --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
