# Run detail: overview, prompt, response and orchestration steps  `huf-executions-run-detail`

HUF, Executions > run AR-2026-0412: status, agent, provider, model, tokens and cost, the prompt and response, and the child runs of the orchestration (the routed steps).

**When to use:** Establishing shot for a run-trace story.

**Slots people usually change:** `text_ink_5` (relative-time, e.g. "1 day ago"), `text_ink_13` (currency, e.g. "$0.000900"), `text_steel_7` (relative-time, e.g. "1 day ago"), `text_steel_9` (relative-time, e.g. "1 day ago"), `text_steel_11` (relative-time, e.g. "1 day ago"), `text_ink_10` (number, e.g. "412"). All 115 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-executions-run-detail"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-executions-run-detail.link-1`, `huf-executions-run-detail.link-2`, `huf-executions-run-detail.link-3`).

**Render:** `node tools/render.mjs huf-executions-run-detail --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions/AR-2026-0412` with fixtures [base, decisions].
