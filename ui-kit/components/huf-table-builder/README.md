# Table builder (field canvas with column types + field properties)  `huf-table-builder`

Table builder for Orders: ordered field cards with type badges (text, number, currency, dropdown, rating, color, phone, checkbox), a section break, the selected field's properties on the right and the Save bar.

**When to use:** Use to show designing a table's columns.

**Slots people usually change:** `text_steel_10` (text, e.g. "Changes save with the table."), `tracking_wide` (text, e.g. "Additional settings"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `font_normal_3` (text, e.g. "Show in list view"), `font_normal_4` (text, e.g. "Non-negative only"), `text_steel_2` (text, e.g. "maya@example.com"). All 117 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-table-builder"`; 51 interactive elements with measured boxes in `measurements.json` (e.g. `huf-table-builder.link-1`, `huf-table-builder.link-2`, `huf-table-builder.link-3`).

**Render:** `node tools/render.mjs huf-table-builder --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/data/tbl-orders/edit` with fixtures [base, tables-builder].
