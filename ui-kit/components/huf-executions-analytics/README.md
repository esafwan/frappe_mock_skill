# Executions analytics: breakdown by provider  `huf-executions-analytics`

HUF, Executions > Analytics: metric strip, token composition and a "By provider" table (OpenAI, Anthropic, Local Ollama) with runs, success rate, cost and cache ratio.

**When to use:** Shows how work is split across hosted and local models.

**Slots people usually change:** `truncate_2` (relative-time, e.g. "Updated 5 mins ago"), `text_ink_4` (currency, e.g. "$14.2386"), `shrink_0_2` (number, e.g. "118,000"), `shrink_0_7` (number, e.g. "142,000"), `shrink_0_12` (number, e.g. "201,000"), `text_steel_7` (number, e.g. "4.9120"). All 123 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-executions-analytics"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-executions-analytics.link-1`, `huf-executions-analytics.link-2`, `huf-executions-analytics.link-3`).

**Render:** `node tools/render.mjs huf-executions-analytics --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions?tab=analytics` with fixtures [base, decisions].
