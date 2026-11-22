# Gateways > Pending access (3 senders waiting for approval)  `huf-gateway-pending`

Settings > Gateways for the fictional wholesaler Northwind Trading: tabs (Gateways, Pending access with a count, Channel credentials), the overview card and the Pending access tab: "Approve by pairing code" form and the pending pairing requests (sender, gateway, code, expiry, Approve / Revoke).

**When to use:** Establishing shot for "connect your messaging channels to agents"; data in data/huf/gateway.json.

**Slots people usually change:** `text_steel_16` (relative-time, e.g. "29 mins ago"), `text_steel_20` (relative-time, e.g. "42 mins ago"), `text_steel_12` (relative-time, e.g. "8 mins ago"), `text_steel_2` (text, e.g. "Paste the code the sender shar"), `text_steel_3` (text, e.g. "Senders who messaged a gateway"), `text_ink_2` (text, e.g. "Pending pairing requests"). All 69 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-pending"`; 31 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-pending.button-1`, `huf-gateway-pending.link-2`, `huf-gateway-pending.link-3`).

**Render:** `node tools/render.mjs huf-gateway-pending --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways?tab=pending-access` with fixtures [base, agents, whatsapp, gateway].
