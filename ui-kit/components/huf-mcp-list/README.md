# MCP servers page (tool connections: connected, token expired, disabled)  `huf-mcp-list`

MCP servers screen: cards for Northwind Orders, Shared Drive, Support Desk, Team Calendar and Legacy Pricing with status pills (enabled, connected, token expired, disabled), namespace and last sync.

**When to use:** Establishing shot for "connect your agent to tools" stories.

**Slots people usually change:** `text_steel_6` (relative-time, e.g. "12 hours ago"), `text_steel_16` (relative-time, e.g. "2 days ago"), `text_steel_11` (relative-time, e.g. "1 day ago"), `text_steel_21` (relative-time, e.g. "1 day ago"), `min_h_2_5rem_2` (text, e.g. "Search and read supplier contr"), `min_h_2_5rem` (text, e.g. "Look up orders, shipments and "). All 70 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-mcp-list"`; 22 interactive elements with measured boxes in `measurements.json` (e.g. `huf-mcp-list.button-1`, `huf-mcp-list.link-2`, `huf-mcp-list.link-3`).

**Render:** `node tools/render.mjs huf-mcp-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/mcp` with fixtures [base, providers].
