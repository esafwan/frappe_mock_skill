# Gateway detail: Slack, Connection tab (credentials saved, connected)  `huf-gateway-detail`

Gateway detail for the "Northwind Slack" channel (/gateways/<setting>): title, Connected status line with the last check, Test connection / Use in agent / Delete, tabs Connection, Recipients, Channel. Connection tab: name, credentials (Slack Bot Token, Signing Secret, both "Saved"), the "How to connect Slack" guide and the Active / Use by default options.

**When to use:** The same page serves WhatsApp, Teams, Telegram and Email gateways (credential fields come from the service).

**Slots people usually change:** `text_steel_4` (relative-time, e.g. "15 mins ago"), `text_steel_6` (text, e.g. "Shown in lists and when you pi"), `text_muted_foreground` (text, e.g. "Saved values stay hidden. Leav"), `text_steel_9` (text, e.g. "Used automatically when a step"), `text_foreground` (text, e.g. "Connected as @northwind-assist"), `text_steel_8` (text, e.g. "Turn off to pause this connect"). All 59 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-detail"`; 34 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-detail.button-1`, `huf-gateway-detail.link-2`, `huf-gateway-detail.link-3`).

**Render:** `node tools/render.mjs huf-gateway-detail --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways/slack-northwind` with fixtures [base, agents, whatsapp, gateway].
