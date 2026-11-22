# Playground: Decision Runtime bench (default)  `huf-decisions-playground`

HUF, Playground (Decision Runtime workbench) for the fictional Northwind Trading: empty bench with the Decision Runtime card (model, deployment Auto, provider and provider model ID resolved after run), agent/provider/model strip, prompt, response, trace and run ledger.

**When to use:** The "Decision Runtime" card is the decision model: canonical model, deployment (Auto / Primary / Fallback), and provider + provider model ID resolved after each run. Text comes from data/huf/decisions.json.

**Slots people usually change:** `text_steel_3` (text, e.g. "Canonical decision model and d"), `text_steel_soft_16` (text, e.g. "No runs yet — completed runs a"), `text_steel_soft_14` (text, e.g. "Run a prompt to see the respon"), `text_steel_soft_15` (text, e.g. "Run a prompt to see its trace "), `text_12_5px` (text, e.g. "Pick a provider first"), `hover_text_ink` (text, e.g. "Evaluation criteria"). All 108 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-decisions-playground"`; 38 interactive elements with measured boxes in `measurements.json` (e.g. `huf-decisions-playground.link-1`, `huf-decisions-playground.link-2`, `huf-decisions-playground.link-3`).

**Render:** `node tools/render.mjs huf-decisions-playground --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground` with fixtures [base, decisions].
