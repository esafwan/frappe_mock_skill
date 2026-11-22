# Agent editor, Abilities tab: knowledge sources (ready / failed) and actions  `huf-agent-editor-knowledge`

Abilities tab with the Knowledge section: sources with mode and health status, then the Actions list.

**When to use:** Use to show what documents an agent answers from.

**Slots people usually change:** `text_steel_soft_2` (relative-time, e.g. "8 mins ago"), `text_steel_soft_4` (number, e.g. "5120"), `text_steel_8` (text, e.g. "Fetch one order by order numbe"), `text_steel_10` (text, e.g. "Reply to the customer in the c"), `text_steel_11` (text, e.g. "Open a ticket for the support "), `text_steel_7` (text, e.g. "Things it can do: tools and co"). All 135 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-agent-editor-knowledge"`; 72 interactive elements with measured boxes in `measurements.json` (e.g. `huf-agent-editor-knowledge.link-1`, `huf-agent-editor-knowledge.link-2`, `huf-agent-editor-knowledge.link-3`).

**Render:** `node tools/render.mjs huf-agent-editor-knowledge --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot#abilities` with fixtures [base, agents, agents-editor].
