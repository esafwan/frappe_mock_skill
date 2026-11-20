# Procedure detail, read-only active procedure (header, validation status, definition, version history)  `huf-procedures-detail`

Procedure detail: name with Compiled / Active badges, plain-language explainer, Test button, id / version / fingerprint / read-only facts, "Fingerprinted - passed validation", the compiled step graph and earlier versions.

**When to use:** Read-only procedures need no approval card.

**Slots people usually change:** `text_sm_6` (relative-time, e.g. "2 hours ago"), `text_steel_11` (relative-time, e.g. "3 weeks ago"), `text_steel_12` (relative-time, e.g. "1 month ago"), `text_sm_2` (number, e.g. "1.2"), `overflow_auto` (text, e.g. "{ "nodes": [ { "id": "n1", "ty"), `text_steel_soft` (text, e.g. "Read-only means it can only lo"). All 90 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-procedures-detail"`; 28 interactive elements with measured boxes in `measurements.json` (e.g. `huf-procedures-detail.link-1`, `huf-procedures-detail.link-2`, `huf-procedures-detail.link-3`).

**Render:** `node tools/render.mjs huf-procedures-detail --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/procedures/AP-0007` with fixtures [base, agents, procedures].
