# Analytics tab, cost per model  `huf-analytics-model`

Analytics tab (Executions > Analytics) for the fictional supplier Northwind Trading, last 7 days: four gauges (runs, cache ratio, LLM cost, average duration), the "By model" table: gpt-4.1, gpt-4.1-mini, mistral-small, mistral-large ... with their LLM cost each and the context-composition bars.

**When to use:** Cost is visible per agent, per model and per provider; there is no per-seat charge anywhere. Numbers come from data/huf/audit.json.

**Slots people usually change:** `truncate_2` (relative-time, e.g. "Updated 5 mins ago"), `shrink_0_2` (number, e.g. "1,840,000"), `shrink_0_7` (number, e.g. "2,960,000"), `shrink_0_12` (number, e.g. "4,120,000"), `shrink_0_17` (number, e.g. "7,300,000"), `shrink_0_22` (number, e.g. "2,200,000"). All 141 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-analytics-model"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-analytics-model.link-1`, `huf-analytics-model.link-2`, `huf-analytics-model.link-3`).

**Render:** `node tools/render.mjs huf-analytics-model --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions?tab=analytics` with fixtures [base, agents, audit].
