# Integrations page with the "Add Integration" catalog open  `huf-integrations-catalog`

The service catalog dialog over the Integrations page: services grouped by category with logos and short descriptions, ready to connect.

**When to use:** Root is body (the dialog is a portal).

**Slots people usually change:** `text_steel_soft` (relative-time, e.g. "Checked 15 hours ago"), `text_steel_soft_2` (relative-time, e.g. "Checked 4 hours ago"), `text_steel_soft_3` (relative-time, e.g. "Checked 30 mins ago"), `text_steel_soft_4` (relative-time, e.g. "Checked 15 mins ago"), `text_steel_soft_5` (relative-time, e.g. "Checked 2 hours ago"), `text_steel_soft_7` (relative-time, e.g. "Checked 3 hours ago"). All 217 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-integrations-catalog"`; 59 interactive elements with measured boxes in `measurements.json` (e.g. `huf-integrations-catalog.button-2`, `huf-integrations-catalog.link-3`, `huf-integrations-catalog.link-4`).

**Render:** `node tools/render.mjs huf-integrations-catalog --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/integrations` with fixtures [base, agents, whatsapp, gateway].
