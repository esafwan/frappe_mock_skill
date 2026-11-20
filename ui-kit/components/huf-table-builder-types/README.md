# Table builder with the column type picker open  `huf-table-builder-types`

Builder with the Add field menu open: column types grouped as Text, Numbers, Date & time, Choice, Reference, Other, Media.

**When to use:** undefined

**Slots people usually change:** `text_sm_2` (text, e.g. "Customer orders from the web s"), `text_steel_22` (text, e.g. "Points to a row in another tab"), `text_steel_soft` (text, e.g. "Configure your table propertie"), `text_steel_10` (text, e.g. "Longer notes over several line"), `text_steel_28` (text, e.g. "Groups fields under a heading"), `text_steel_29` (text, e.g. "Splits a section into columns"). All 169 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-builder-types"`; 68 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-builder-types.link-2`, `huf-table-builder-types.link-3`, `huf-table-builder-types.link-4`).

**Render:** `node tools/render.mjs huf-table-builder-types --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data/tbl-orders/edit` with fixtures [base, tables-builder].
