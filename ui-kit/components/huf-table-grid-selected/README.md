# Table grid with rows selected (bulk action bar)  `huf-table-grid-selected`

Orders grid with three rows ticked and the floating bulk bar (Set value, Copy, Export, Delete).

**When to use:** Use to show bulk edits on rows.

**Slots people usually change:** `tabular_nums_2` (number, e.g. "189.00"), `tabular_nums_4` (number, e.g. "498.00"), `tabular_nums_6` (number, e.g. "237.00"), `tabular_nums_10` (number, e.g. "840.00"), `tabular_nums_12` (number, e.g. "165.00"), `tabular_nums_18` (number, e.g. "567.00"). All 455 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-grid-selected"`; 335 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-grid-selected.link-1`, `huf-table-grid-selected.link-2`, `huf-table-grid-selected.link-3`).

**Render:** `node tools/render.mjs huf-table-grid-selected --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data/tbl-orders` with fixtures [base, tables].
