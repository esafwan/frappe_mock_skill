# Dashboard, Flows tab (active flows with run counts)  `huf-cost-dashboard-flows`

Dashboard with the Flows tab open: active flows, last run and run count each.

**When to use:** Same gauge strip as huf-cost-dashboard.

**Slots people usually change:** `truncate_3` (relative-time, e.g. "Last run 16 mins ago"), `truncate_7` (relative-time, e.g. "Last run 1 hour ago"), `truncate_11` (relative-time, e.g. "Last run 1 hour ago"), `text_ink_5` (currency, e.g. "$67.6052"), `text_ink_2` (number, e.g. "5,130"), `text_ink_3` (number, e.g. "97.1%"). All 80 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-cost-dashboard-flows"`; 32 interactive elements with measured boxes in `measurements.json` (e.g. `huf-cost-dashboard-flows.link-1`, `huf-cost-dashboard-flows.link-2`, `huf-cost-dashboard-flows.link-3`).

**Render:** `node tools/render.mjs huf-cost-dashboard-flows --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/dashboard` with fixtures [base, agents, audit].
