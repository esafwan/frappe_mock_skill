# Tables list (ledger: table, agent access, rows, fields, updated)  `huf-table-list`

Tables screen: page title with Import and New table, search, group pills, status sentence and the tables ledger showing which agents can use each table.

**When to use:** Establishing shot for any story about giving agents structured data; change table names and agent access through the fixture data.

**Slots people usually change:** `text_right_4` (relative-time, e.g. "15 hours ago"), `text_right_6` (relative-time, e.g. "3 days ago"), `text_right_7` (relative-time, e.g. "4 days ago"), `text_right_8` (relative-time, e.g. "1 week ago"), `text_right_5` (relative-time, e.g. "1 day ago"), `text_steel_4` (number, e.g. "1,284"). All 106 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-list"`; 40 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-list.link-1`, `huf-table-list.link-2`, `huf-table-list.link-3`).

**Render:** `node tools/render.mjs huf-table-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data` with fixtures [base, tables].
