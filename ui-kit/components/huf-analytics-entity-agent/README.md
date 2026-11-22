# Analytics entity page: one agent (Order Status Bot)  `huf-analytics-entity-agent`

Analytics entity page (/analytics/<dimension>/<name>): breadcrumb, the same four gauges scoped to one agent, "Runs over time" area chart (hourly, 7 days) and context composition.

**When to use:** Reached by clicking a row of the Analytics table.

**Slots people usually change:** `truncate` (relative-time, e.g. "Updated 5 mins ago"), `entity_name_4` (currency, e.g. "$38.2416"), `entity_name_2` (number, e.g. "2,140"), `entity_name_3` (number, e.g. "64.5%"), `entity_name_5` (number, e.g. "3.1"), `recharts_cartesian_axis_tick_value_13` (number, e.g. "16"). All 90 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-analytics-entity-agent"`; 25 interactive elements with measured boxes in `measurements.json` (e.g. `huf-analytics-entity-agent.link-1`, `huf-analytics-entity-agent.link-2`, `huf-analytics-entity-agent.link-3`).

**Render:** `node tools/render.mjs huf-analytics-entity-agent --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/analytics/agent/Order%20Status%20Bot` with fixtures [base, agents, audit].
