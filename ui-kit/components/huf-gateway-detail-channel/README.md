# Gateway detail: Slack, Channel tab (ready, routing, access policy, waiting people)  `huf-gateway-detail-channel`

Gateway detail for the "Northwind Slack" channel (/gateways/<setting>): title, Connected status line with the last check, Test connection / Use in agent / Delete, tabs Connection, Recipients, Channel. Channel tab, top of the page: "Ready to receive messages", Channel enabled, Run as user, Connection, Routing target (Agent: Support Triage), Direct message policy (Pairing) and new-sender limits.

**When to use:** The same page serves WhatsApp, Teams, Telegram and Email gateways (credential fields come from the service).

**Slots people usually change:** `text_steel_4` (relative-time, e.g. "15 mins ago"), `text_muted_foreground_9` (relative-time, e.g. "19 mins ago"), `role_checkbox_translate_y_2px_10` (relative-time, e.g. "19 mins ago"), `role_checkbox_translate_y_2px_13` (relative-time, e.g. "27 mins ago"), `role_checkbox_translate_y_2px_16` (relative-time, e.g. "42 mins ago"), `text_steel_14` (relative-time, e.g. "42 min ago"). All 312 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-detail-channel"`; 109 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-detail-channel.button-1`, `huf-gateway-detail-channel.link-2`, `huf-gateway-detail-channel.link-3`).

**Render:** `node tools/render.mjs huf-gateway-detail-channel --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways/slack-northwind` with fixtures [base, agents, whatsapp, gateway].
