# Dashboard (4 gauges incl. total cost, active agents list)  `huf-cost-dashboard`

Dashboard home for Northwind Trading: gauge strip (agent runs, success rate, average runtime, total cost for the last 7 days) above the Agents / Flows / Executions tabs with run counts per agent.

**When to use:** Establishing shot for "what are my agents costing me"; totals are in data/huf/audit.json.

**Slots people usually change:** `text_ink_5` (currency, e.g. "$67.6052"), `text_ink_2` (number, e.g. "5,130"), `text_ink_3` (number, e.g. "97.1%"), `truncate_5` (number, e.g. "1284"), `truncate_13` (number, e.g. "5120"), `truncate_9` (number, e.g. "342"). All 90 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-cost-dashboard"`; 34 interactive elements with measured boxes in `measurements.json` (e.g. `huf-cost-dashboard.link-1`, `huf-cost-dashboard.link-2`, `huf-cost-dashboard.link-3`).

**Render:** `node tools/render.mjs huf-cost-dashboard --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/dashboard` with fixtures [base, agents, audit].
