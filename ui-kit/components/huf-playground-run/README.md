# Playground, completed agent run (response, trace steps, evaluation pass, run ledger)  `huf-playground-run`

Playground (Single mode) for Northwind Trading: Decision Runtime strip, Agent / Provider / Model / Temp · max tok bar, Prompt, Response and Trace panels and the Run ledger. Order Status Bot answered a WhatsApp delay question: response with latency, tokens and cost in the header, three trace steps (agent, lookup_order tool, agent), an evaluation verdict and the run ledger with earlier runs.

**When to use:** Full 1440x900 page with the app sidebar collapsed (the Playground closes it for width).

**Slots people usually change:** `text_steel_14` (time, e.g. "09:00:00"), `text_steel_17` (time, e.g. "08:42:00"), `text_steel_20` (time, e.g. "08:19:00"), `text_steel_23` (time, e.g. "07:24:00"), `response` (text, e.g. "Order NW-20418 left our Rotter"), `focus_visible_ring_0` (text, e.g. "A customer on WhatsApp asks: ""). All 163 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-playground-run"`; 50 interactive elements with measured boxes in `measurements.json` (e.g. `huf-playground-run.link-1`, `huf-playground-run.link-2`, `huf-playground-run.link-3`).

**Render:** `node tools/render.mjs huf-playground-run --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground?demo=ledger` with fixtures [base, agents-editor, agents, playground].
