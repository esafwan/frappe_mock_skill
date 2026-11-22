# Playground: completed run with response, evaluation, routed trace and ledger  `huf-decisions-playground-run`

HUF, Playground (Decision Runtime workbench) for the fictional Northwind Trading: Support Triage run finished: filled prompt and evaluation criteria, response with pass score, latency/token/cost stats, a 3-step trace (route on local Llama, tool and agent steps on gpt-4.1-mini) and the run ledger row.

**When to use:** The "Decision Runtime" card is the decision model: canonical model, deployment (Auto / Primary / Fallback), and provider + provider model ID resolved after each run. Text comes from data/huf/decisions.json.

**Slots people usually change:** `text_steel_15` (time, e.g. "09:00:00"), `leading_relaxed` (text, e.g. "Category: delivery. Priority: "), `prompt_1` (text, e.g. "A customer writes: "My order N"), `prompt_2` (text, e.g. "Names the right category, give"), `truncate_3` (text, e.g. "Correct category, priority giv"), `text_steel_3` (text, e.g. "Canonical decision model and d"). All 140 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-decisions-playground-run"`; 44 interactive elements with measured boxes in `measurements.json` (e.g. `huf-decisions-playground-run.link-1`, `huf-decisions-playground-run.link-2`, `huf-decisions-playground-run.link-3`).

**Render:** `node tools/render.mjs huf-decisions-playground-run --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground` with fixtures [base, decisions].
