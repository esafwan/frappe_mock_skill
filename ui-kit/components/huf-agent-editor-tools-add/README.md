# Agent editor with the Add tool dialog open  `huf-agent-editor-tools-add`

Add tool dialog over the Abilities tab listing available tools.

**When to use:** undefined

**Slots people usually change:** `text_steel_soft_2` (relative-time, e.g. "8 mins ago"), `text_steel_soft_4` (number, e.g. "5120"), `text_muted_foreground` (text, e.g. "Choose tools to add to this ag"), `text_steel_8` (text, e.g. "Fetch one order by order numbe"), `text_steel_10` (text, e.g. "Reply to the customer in the c"), `text_steel_11` (text, e.g. "Open a ticket for the support "). All 185 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-agent-editor-tools-add"`; 95 interactive elements with measured boxes in `measurements.json` (e.g. `huf-agent-editor-tools-add.link-2`, `huf-agent-editor-tools-add.link-3`, `huf-agent-editor-tools-add.link-4`).

**Render:** `node tools/render.mjs huf-agent-editor-tools-add --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot#abilities` with fixtures [base, agents, agents-editor].
