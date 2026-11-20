# Gateway activity card (24h / 7d counts, recent messages)  `huf-gateway-activity`

Activity of a gateway: On badge, last message, messages and problems in the last 24 hours and 7 days, usage cost and tokens, and recent messages with who sent them, status (Done / Blocked) and which agent or flow handled them.

**When to use:** Data in data/huf/gateway.json (health).

**Slots people usually change:** `text_muted_foreground_2` (relative-time, e.g. "19 mins ago"), `role_checkbox_translate_y_2px_5` (relative-time, e.g. "19 mins ago"), `role_checkbox_translate_y_2px_8` (relative-time, e.g. "27 mins ago"), `role_checkbox_translate_y_2px_11` (relative-time, e.g. "42 mins ago"), `role_checkbox_translate_y_2px_14` (relative-time, e.g. "1 hour ago"), `font_semibold_4` (currency, e.g. "$4.82"). All 38 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-activity"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-activity.button-1`, `huf-gateway-activity.button-2`).

**Render:** `node tools/render.mjs huf-gateway-activity --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways/slack-northwind` with fixtures [base, agents, whatsapp, gateway].
