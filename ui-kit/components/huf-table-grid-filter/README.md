# Table grid with filter builder open  `huf-table-grid-filter`

Orders grid with the filter builder popover open under the toolbar.

**When to use:** undefined

**Slots people usually change:** `tabular_nums_2` (number, e.g. "189.00"), `tabular_nums_4` (number, e.g. "498.00"), `tabular_nums_6` (number, e.g. "237.00"), `tabular_nums_10` (number, e.g. "840.00"), `tabular_nums_12` (number, e.g. "165.00"), `tabular_nums_18` (number, e.g. "567.00"). All 485 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-grid-filter"`; 337 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-grid-filter.link-2`, `huf-table-grid-filter.link-3`, `huf-table-grid-filter.link-4`).

**Render:** `node tools/render.mjs huf-table-grid-filter --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data/tbl-orders` with fixtures [base, tables].
