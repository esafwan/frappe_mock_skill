# MCP server detail, Tools tab (synced tools with enable switches)  `huf-mcp-detail-tools`

MCP server detail for Northwind Orders on the Tools tab: auto-sync settings, last sync, and the table of five tools (orders_lookup, shipment_track, stock_level, customer_balance, order_cancel) with enable switches.

**When to use:** Header shows Enabled badge, Sync Now and Test Connection.

**Slots people usually change:** `text_steel_4` (relative-time, e.g. "12 hours ago"), `truncate_3` (text, e.g. "Return the carrier, tracking n"), `truncate_2` (text, e.g. "Find an order by number, custo"), `truncate_4` (text, e.g. "Current stock on hand for a pr"), `truncate_5` (text, e.g. "Outstanding balance and credit"), `truncate_6` (text, e.g. "Cancel an order that has not s"). All 72 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-mcp-detail-tools"`; 41 interactive elements with measured boxes in `measurements.json` (e.g. `huf-mcp-detail-tools.button-1`, `huf-mcp-detail-tools.link-2`, `huf-mcp-detail-tools.link-3`).

**Render:** `node tools/render.mjs huf-mcp-detail-tools --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/mcp/Northwind%20Orders#tools` with fixtures [base, providers].
