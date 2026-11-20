# MCP server detail, Connection tab (HTTP endpoint with API key)  `huf-mcp-detail-connection`

MCP server detail on the Connection tab: transport type, server URL (https://mcp.northwind.example/orders) and API-key authentication header.

**When to use:** Use after the list to show how a tool server is wired.

**Slots people usually change:** `text_muted_foreground` (text, e.g. "Paste the MCP endpoint and cli"), `text_muted_foreground_2` (text, e.g. "Authentication mode, transport"), `text_steel_2` (text, e.g. "e.g. https://mcp.higgsfield.ai"), `group_data_collapsible_icon_hidden_4` (text, e.g. "AI providers & models"), `font_medium` (text, e.g. "Connection Status"), `text_base` (text, e.g. "Advanced settings"). All 44 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-mcp-detail-connection"`; 28 interactive elements with measured boxes in `measurements.json` (e.g. `huf-mcp-detail-connection.button-1`, `huf-mcp-detail-connection.link-2`, `huf-mcp-detail-connection.link-3`).

**Render:** `node tools/render.mjs huf-mcp-detail-connection --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/mcp/Northwind%20Orders#connection` with fixtures [base, providers].
