# Gateways page, no gateways yet  `huf-gateway-list-empty`

Settings > Gateways for the fictional wholesaler Northwind Trading: tabs (Gateways, Pending access with a count, Channel credentials), the overview card and the empty state ("No gateways" with Add gateway).

**When to use:** Establishing shot for "connect your messaging channels to agents"; data in data/huf/gateway.json.

**Slots people usually change:** `leading_relaxed` (text, e.g. "Gateways connect your messagin"), `text_pretty` (text, e.g. "Connect WhatsApp, Messenger, I"), `text_steel_3` (text, e.g. "Configure routing targets, acc"), `text_steel_2` (text, e.g. "Only approved senders can reac"), `group_data_collapsible_icon_hidden_4` (text, e.g. "AI providers & models"), `gap_1_5_3` (text, e.g. "Channel credentials"). All 35 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-list-empty"`; 22 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-list-empty.button-1`, `huf-gateway-list-empty.link-2`, `huf-gateway-list-empty.link-3`).

**Render:** `node tools/render.mjs huf-gateway-list-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways` with fixtures [base, agents, whatsapp, gateway].
