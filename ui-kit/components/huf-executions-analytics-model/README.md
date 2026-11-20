# Executions analytics: breakdown by model  `huf-executions-analytics-model`

HUF, Executions > Analytics with the dimension switched to Model: gpt-4.1-mini, claude-sonnet, llama3.1-8b and gpt-4.1 compared on cost, speed and success rate.

**When to use:** Use for a cost-per-model decision story.

**Slots people usually change:** `truncate_2` (relative-time, e.g. "Updated 5 mins ago"), `text_ink_4` (currency, e.g. "$14.2386"), `shrink_0_2` (number, e.g. "118,000"), `shrink_0_7` (number, e.g. "142,000"), `shrink_0_12` (number, e.g. "201,000"), `text_steel_7` (number, e.g. "1.8420"). All 129 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-executions-analytics-model"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-executions-analytics-model.link-1`, `huf-executions-analytics-model.link-2`, `huf-executions-analytics-model.link-3`).

**Render:** `node tools/render.mjs huf-executions-analytics-model --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions?tab=analytics` with fixtures [base, decisions].
