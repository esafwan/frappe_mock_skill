# Gateways page with the quick "Add gateway" form open (filled)  `huf-gateway-list-add`

Settings > Gateways for the fictional wholesaler Northwind Trading: tabs (Gateways, Pending access with a count, Channel credentials), the overview card and the quick add form open under the header: gateway name, channel provider select (WhatsApp) and "Create & Configure"; picking WhatsApp continues in the Channels setup wizard (huf-channels-setup).

**When to use:** Establishing shot for "connect your messaging channels to agents"; data in data/huf/gateway.json.

**Slots people usually change:** `text_steel_21` (relative-time, e.g. "19 mins ago"), `text_steel_46` (relative-time, e.g. "40 mins ago"), `text_steel_12` (relative-time, e.g. "3 mins ago"), `text_steel_30` (relative-time, e.g. "1 hour ago"), `leading_relaxed` (text, e.g. "Gateways connect your messagin"), `text_steel_3` (text, e.g. "Configure routing targets, acc"). All 136 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-list-add"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-list-add.button-1`, `huf-gateway-list-add.link-2`, `huf-gateway-list-add.link-3`).

**Render:** `node tools/render.mjs huf-gateway-list-add --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways` with fixtures [base, agents, whatsapp, gateway].
