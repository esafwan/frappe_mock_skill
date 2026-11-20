# Agent editor, Abilities tab scrolled to Actions (tools and MCP server rows)  `huf-agent-editor-tools`

Actions section with attached tools and a connected MCP server.

**When to use:** undefined

**Slots people usually change:** `text_steel_soft_2` (relative-time, e.g. "8 mins ago"), `text_steel_soft_4` (number, e.g. "5120"), `text_steel_8` (text, e.g. "Fetch one order by order numbe"), `text_steel_10` (text, e.g. "Reply to the customer in the c"), `text_steel_11` (text, e.g. "Open a ticket for the support "), `text_steel_7` (text, e.g. "Things it can do: tools and co"). All 135 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-agent-editor-tools"`; 72 interactive elements with measured boxes in `measurements.json` (e.g. `huf-agent-editor-tools.link-1`, `huf-agent-editor-tools.link-2`, `huf-agent-editor-tools.link-3`).

**Render:** `node tools/render.mjs huf-agent-editor-tools --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot#abilities` with fixtures [base, agents, agents-editor].
