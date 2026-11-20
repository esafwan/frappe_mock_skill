# Analytics tab, cost by provider (default)  `huf-analytics-provider`

Analytics tab (Executions > Analytics) for the fictional supplier Northwind Trading, last 7 days: four gauges (runs, cache ratio, LLM cost, average duration), the "By provider" table (runs, success rate, LLM cost, average duration) and the context-composition bars.

**When to use:** Cost is visible per agent, per model and per provider; there is no per-seat charge anywhere. Numbers come from data/huf/audit.json.

**Slots people usually change:** `truncate_2` (relative-time, e.g. "Updated 5 mins ago"), `shrink_0_2` (number, e.g. "1,840,000"), `shrink_0_7` (number, e.g. "2,960,000"), `shrink_0_12` (number, e.g. "4,120,000"), `shrink_0_17` (number, e.g. "7,300,000"), `shrink_0_22` (number, e.g. "2,200,000"). All 123 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-analytics-provider"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-analytics-provider.link-1`, `huf-analytics-provider.link-2`, `huf-analytics-provider.link-3`).

**Render:** `node tools/render.mjs huf-analytics-provider --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions?tab=analytics` with fixtures [base, agents, audit].
