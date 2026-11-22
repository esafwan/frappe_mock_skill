# Playground: trace step expanded (provider, model, tokens, cost per step)  `huf-decisions-playground-trace`

HUF, Playground (Decision Runtime workbench) for the fictional Northwind Trading: same finished run with trace step 1 expanded: the routing step handled by the local model (Provider Local Ollama, Model llama3.1-8b, tokens, cost $0.0000).

**When to use:** The "Decision Runtime" card is the decision model: canonical model, deployment (Auto / Primary / Fallback), and provider + provider model ID resolved after each run. Text comes from data/huf/decisions.json.

**Slots people usually change:** `text_steel_15` (time, e.g. "09:00:00"), `text_ink_8` (currency, e.g. "$0.0000"), `text_ink_6` (number, e.g. "118"), `leading_relaxed` (text, e.g. "Category: delivery. Priority: "), `focus_visible_ring_0` (text, e.g. "A customer writes: "My order N"), `focus_visible_ring_1` (text, e.g. "Names the right category, give"). All 152 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-decisions-playground-trace"`; 44 interactive elements with measured boxes in `measurements.json` (e.g. `huf-decisions-playground-trace.link-1`, `huf-decisions-playground-trace.link-2`, `huf-decisions-playground-trace.link-3`).

**Render:** `node tools/render.mjs huf-decisions-playground-trace --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground` with fixtures [base, decisions].
