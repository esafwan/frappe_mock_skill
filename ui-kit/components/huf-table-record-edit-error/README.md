# Record panel with a validation error  `huf-table-record-edit-error`

Record panel after typing text into a number field: the field shows its inline error.

**When to use:** undefined

**Slots people usually change:** `tabular_nums_2` (number, e.g. "189.00"), `tabular_nums_4` (number, e.g. "498.00"), `tabular_nums_6` (number, e.g. "237.00"), `tabular_nums_10` (number, e.g. "840.00"), `tabular_nums_12` (number, e.g. "165.00"), `tabular_nums_18` (number, e.g. "567.00"). All 477 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-record-edit-error"`; 344 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-record-edit-error.link-2`, `huf-table-record-edit-error.link-3`, `huf-table-record-edit-error.link-4`).

**Render:** `node tools/render.mjs huf-table-record-edit-error --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data/tbl-orders` with fixtures [base, tables].
