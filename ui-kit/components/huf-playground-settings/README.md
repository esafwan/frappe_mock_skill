# Playground, generation settings (direct run, model picker open, evaluation criteria)  `huf-playground-settings`

Playground (Single mode) for Northwind Trading: Decision Runtime strip, Agent / Provider / Model / Temp · max tok bar, Prompt, Response and Trace panels and the Run ledger. Direct run (no agent): provider OpenAI, temperature 0.3, max tokens 800, evaluation criteria expanded and the Model dropdown open.

**When to use:** Full 1440x900 page with the app sidebar collapsed (the Playground closes it for width).

**Slots people usually change:** `focus_visible_ring_0` (text, e.g. "Write a friendly two-line What"), `focus_visible_ring_1` (text, e.g. "Mentions the carrier and the n"), `text_steel_3` (text, e.g. "Canonical decision model and d"), `text_steel_soft_16` (text, e.g. "No runs yet — completed runs a"), `text_steel_soft_14` (text, e.g. "Run a prompt to see the respon"), `text_steel_soft_15` (text, e.g. "Run a prompt to see its trace "). All 115 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-playground-settings"`; 42 interactive elements with measured boxes in `measurements.json` (e.g. `huf-playground-settings.link-2`, `huf-playground-settings.link-3`, `huf-playground-settings.link-4`).

**Render:** `node tools/render.mjs huf-playground-settings --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground` with fixtures [base, agents-editor, agents, playground].
