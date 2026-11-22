# Executions: agent runs list with metrics strip  `huf-executions-runs`

HUF, Executions > Agent runs: Runs / Cache ratio / LLM cost / Average duration strip, filters (status, time, agent) and the run table (agent, run ID, status, cost, cached tokens, duration, started) for Northwind Trading.

**When to use:** Establishing shot for any run-history or audit story; rows from data/huf/decisions.json.

**Slots people usually change:** `text_steel_42` (relative-time, e.g. "2 days ago"), `text_steel_47` (relative-time, e.g. "2 days ago"), `text_steel_52` (relative-time, e.g. "2 days ago"), `text_steel_11` (currency, e.g. "$0.000900"), `text_steel_14` (relative-time, e.g. "1 day ago"), `text_steel_16` (currency, e.g. "$0.002100"). All 159 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-executions-runs"`; 36 interactive elements with measured boxes in `measurements.json` (e.g. `huf-executions-runs.link-1`, `huf-executions-runs.link-2`, `huf-executions-runs.link-3`).

**Render:** `node tools/render.mjs huf-executions-runs --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions` with fixtures [base, decisions].
