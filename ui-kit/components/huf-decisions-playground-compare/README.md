# Playground: compare two models side by side  `huf-decisions-playground-compare`

HUF, Playground (Decision Runtime workbench) for the fictional Northwind Trading: Compare mode: column A gpt-4.1-mini and column B claude-sonnet run on the same prompt, with latency, tokens and cost for each, so the cheaper or faster decision model is visible.

**When to use:** The "Decision Runtime" card is the decision model: canonical model, deployment (Auto / Primary / Fallback), and provider + provider model ID resolved after each run. Text comes from data/huf/decisions.json.

**Slots people usually change:** `text_steel_10` (time, e.g. "09:00:00"), `text_steel_13` (time, e.g. "09:00:00"), `focus_visible_ring_0` (text, e.g. "A customer writes: "My order N"), `focus_visible_ring_0_2` (text, e.g. "A customer writes: "My order N"), `bg_destructive_tint` (text, e.g. "P2 (delivered but not received"), `text_steel_5` (text, e.g. "ok · 1.84s · 508 tok · $0.0009"). All 185 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-decisions-playground-compare"`; 57 interactive elements with measured boxes in `measurements.json` (e.g. `huf-decisions-playground-compare.link-1`, `huf-decisions-playground-compare.link-2`, `huf-decisions-playground-compare.link-3`).

**Render:** `node tools/render.mjs huf-decisions-playground-compare --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground` with fixtures [base, decisions].
