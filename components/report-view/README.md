# Report view  `report-view`

Report view with datatable.

**When to use:** Use for tabular data scenes with sortable columns.

**Slots people usually change:** `dt_cell_content_col_6` (date, e.g. "22-10-2026"), `dt_cell_content_col_7` (date, e.g. "22-10-2026"), `dt_cell_content_col_6_2` (date, e.g. "22-10-2026"), `dt_cell_content_col_7_2` (date, e.g. "22-10-2026"), `dt_cell_content_col_6_3` (date, e.g. "22-10-2026"), `dt_cell_content_col_7_3` (date, e.g. "22-10-2026"). All 824 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="report-view"`; 462 interactive elements with measured boxes in `measurements.json` (e.g. `report-view.input-1`, `report-view.button-2`, `report-view.input-3`).

**Render:** `node tools/render.mjs report-view --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, frappe-report.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
