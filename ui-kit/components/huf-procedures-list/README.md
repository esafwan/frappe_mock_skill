# Procedures list (name, tier, status, version, source flow, updated)  `huf-procedures-list`

Procedures screen: saved agent step sequences in a table with tier badge (Compiled / System / Draft), status, version, source flow and last update; Status and Tier filters above.

**When to use:** Establishing shot for "turn a chat into a repeatable procedure" stories.

**Slots people usually change:** `text_steel_11` (relative-time, e.g. "17 hours ago"), `text_steel_10` (relative-time, e.g. "2 hours ago"), `text_steel_15` (relative-time, e.g. "2 weeks ago"), `text_steel_12` (relative-time, e.g. "3 days ago"), `text_steel_14` (relative-time, e.g. "3 days ago"), `text_steel_13` (relative-time, e.g. "1 day ago"). All 100 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-procedures-list"`; 25 interactive elements with measured boxes in `measurements.json` (e.g. `huf-procedures-list.link-1`, `huf-procedures-list.link-2`, `huf-procedures-list.link-3`).

**Render:** `node tools/render.mjs huf-procedures-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/procedures` with fixtures [base, agents, procedures].
