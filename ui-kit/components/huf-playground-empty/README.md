# Playground, empty bench (Single mode, nothing run yet)  `huf-playground-empty`

Playground (Single mode) for Northwind Trading: Decision Runtime strip, Agent / Provider / Model / Temp · max tok bar, Prompt, Response and Trace panels and the Run ledger. Empty state: placeholders in the prompt, response and trace panels and "No runs yet" in the ledger.

**When to use:** Full 1440x900 page with the app sidebar collapsed (the Playground closes it for width).

**Slots people usually change:** `runtime_caption` (text, e.g. "Canonical decision model and d"), `text_steel_soft_16` (text, e.g. "No runs yet — completed runs a"), `text_steel_soft_14` (text, e.g. "Run a prompt to see the respon"), `text_steel_soft_15` (text, e.g. "Run a prompt to see its trace "), `text_12_5px` (text, e.g. "Pick a provider first"), `hover_text_ink` (text, e.g. "Evaluation criteria"). All 108 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-playground-empty"`; 38 interactive elements with measured boxes in `measurements.json` (e.g. `huf-playground-empty.link-1`, `huf-playground-empty.link-2`, `huf-playground-empty.link-3`).

**Render:** `node tools/render.mjs huf-playground-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground` with fixtures [base, agents-editor, agents, playground].
