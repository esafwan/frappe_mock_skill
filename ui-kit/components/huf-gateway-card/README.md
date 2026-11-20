# Gateway card (WhatsApp, active, routed to an agent)  `huf-gateway-card`

One gateway card: name, Active status dot, description, Channel / Access policy / Route target, Manage WhatsApp and Configure icons, last event and the WhatsApp mark.

**When to use:** Compose several to show "all channels in one place"; text slots: gateway_name, description, metadata values.

**Slots people usually change:** `text_steel_9` (relative-time, e.g. "3 mins ago"), `min_h_2_5rem` (text, e.g. "Order questions and restock al"), `text_steel_7` (text, e.g. "Order Status Bot"), `gateway_name` (text, e.g. "Northwind Sales"), `text_steel_4` (text, e.g. "Access policy"), `text_steel_6` (text, e.g. "Route target"). All 14 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-card"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-card.button-1`, `huf-gateway-card.button-2`).

**Render:** `node tools/render.mjs huf-gateway-card --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways` with fixtures [base, agents, whatsapp, gateway].
