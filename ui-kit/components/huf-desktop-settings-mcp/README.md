# Settings > Local capabilities: Local MCP servers card  `huf-desktop-settings-mcp`

The Local MCP servers card of Settings, Local capabilities (component): inventory and supplier-portal servers, confined, with their tools and per-tool policy (allow / ask / deny).

**When to use:** Same page as huf-desktop-settings-local.

**Slots people usually change:** `block` (text, e.g. "An MCP server is a program on "), `start_0` (text, e.g. "Adding, editing, importing and"), `text_var_steel_12` (text, e.g. "Deliveries booked by a supplie"), `text_var_steel` (text, e.g. "/usr/local/bin/northwind-inven"), `text_var_steel_5` (text, e.g. "Current stock and open purchas"), `text_var_steel_13` (text, e.g. "Send a message to a supplier c"). All 77 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-settings-mcp"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-settings-mcp.button-1`, `huf-desktop-settings-mcp.button-2`, `huf-desktop-settings-mcp.button-3`).

**Render:** `node tools/render.mjs huf-desktop-settings-mcp --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/settings/local` with fixtures [base].
