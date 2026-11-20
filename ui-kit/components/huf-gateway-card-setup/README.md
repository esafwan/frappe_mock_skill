# Gateway card that still needs setup (SMS/voice, 3 to set up)  `huf-gateway-card-setup`

Gateway card for a line that is not live yet: grey "3 to set up" status, "No default route", and the three red setup hints (credentials, route target, turn on).

**When to use:** Pair with huf-gateway-card for a before/after.

**Slots people usually change:** `line_clamp_1_2` (text, e.g. "Choose an agent or flow to rec"), `min_h_2_5rem` (text, e.g. "Two-way SMS and voice line on "), `line_clamp_1` (text, e.g. "Connect credentials for this c"), `line_clamp_1_3` (text, e.g. "Turn the gateway on"), `text_steel_7` (text, e.g. "No default route"), `gateway_name` (text, e.g. "Northwind Voice"). All 14 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-card-setup"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-card-setup.button-1`).

**Render:** `node tools/render.mjs huf-gateway-card-setup --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways` with fixtures [base, agents, whatsapp, gateway].
