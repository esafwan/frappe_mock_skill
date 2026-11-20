# Table grid view (Orders: tabs, toolbar, editable grid, footer)  `huf-table-grid`

Orders table, Data tab: page title with row/field count, Add row, tabs (Data, Fields, Agents, Activity), search, filter and fields menu, an editable spreadsheet-like grid and the pager.

**When to use:** Use as the establishing shot for a spreadsheet-with-agents story.

**Slots people usually change:** `tabular_nums_2` (number, e.g. "189.00"), `tabular_nums_4` (number, e.g. "498.00"), `tabular_nums_6` (number, e.g. "237.00"), `tabular_nums_10` (number, e.g. "840.00"), `tabular_nums_12` (number, e.g. "165.00"), `tabular_nums_18` (number, e.g. "567.00"). All 444 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-grid"`; 329 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-grid.link-1`, `huf-table-grid.link-2`, `huf-table-grid.link-3`).

**Render:** `node tools/render.mjs huf-table-grid --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data/tbl-orders` with fixtures [base, tables].
