# Record panel (edit one order in the right sheet)  `huf-table-record-edit`

Right-hand record panel for one order: title and id, previous/next arrows with position, and every field as a form control that saves when you leave it.

**When to use:** Use to show editing or reviewing a single row.

**Slots people usually change:** `tabular_nums_2` (number, e.g. "189.00"), `tabular_nums_4` (number, e.g. "498.00"), `tabular_nums_6` (number, e.g. "237.00"), `tabular_nums_10` (number, e.g. "840.00"), `tabular_nums_12` (number, e.g. "165.00"), `tabular_nums_18` (number, e.g. "567.00"). All 476 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-record-edit"`; 344 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-record-edit.link-2`, `huf-table-record-edit.link-3`, `huf-table-record-edit.link-4`).

**Render:** `node tools/render.mjs huf-table-record-edit --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data/tbl-orders` with fixtures [base, tables].
