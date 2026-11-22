# Batch jobs list (agent, provider, status, submitted, completed, est. cost)  `huf-batch-jobs`

Batch jobs screen: scheduled-agent batches across OpenAI, Anthropic and Gemini with status dots (Completed, In progress, Submitted, Failed, Expired) and estimated cost.

**When to use:** Use for the "run big jobs at half price overnight" beat.

**Slots people usually change:** `text_steel_11` (relative-time, e.g. "9 hours ago"), `text_steel_36` (relative-time, e.g. "2 weeks ago"), `text_steel_37` (relative-time, e.g. "2 weeks ago"), `text_steel_41` (relative-time, e.g. "1 month ago"), `text_steel_26` (relative-time, e.g. "2 days ago"), `text_steel_27` (relative-time, e.g. "2 days ago"). All 107 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-batch-jobs"`; 26 interactive elements with measured boxes in `measurements.json` (e.g. `huf-batch-jobs.link-1`, `huf-batch-jobs.link-2`, `huf-batch-jobs.link-3`).

**Render:** `node tools/render.mjs huf-batch-jobs --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/batch-jobs` with fixtures [base, tools].
