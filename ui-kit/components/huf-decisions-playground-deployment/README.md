# Playground: deployment picker open (Auto / Primary / Fallback)  `huf-decisions-playground-deployment`

HUF, Playground (Decision Runtime workbench) for the fictional Northwind Trading: the Deployment dropdown open on the Decision Runtime card, showing the routing choices Auto, Primary and Fallback.

**When to use:** The "Decision Runtime" card is the decision model: canonical model, deployment (Auto / Primary / Fallback), and provider + provider model ID resolved after each run. Text comes from data/huf/decisions.json.

**Slots people usually change:** `text_steel_3` (text, e.g. "Canonical decision model and d"), `text_steel_soft_16` (text, e.g. "No runs yet — completed runs a"), `text_steel_soft_14` (text, e.g. "Run a prompt to see the respon"), `text_steel_soft_15` (text, e.g. "Run a prompt to see its trace "), `text_12_5px` (text, e.g. "Pick a provider first"), `hover_text_ink` (text, e.g. "Evaluation criteria"). All 111 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-decisions-playground-deployment"`; 42 interactive elements with measured boxes in `measurements.json` (e.g. `huf-decisions-playground-deployment.link-2`, `huf-decisions-playground-deployment.link-3`, `huf-decisions-playground-deployment.link-4`).

**Render:** `node tools/render.mjs huf-decisions-playground-deployment --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground` with fixtures [base, decisions].
