# Routing rules card (3 rules: channel, channel, catch-all)  `huf-gateway-routing-rules`

Routing rules of a gateway in plain sentences ("When a message arrives in #warehouse, send it to Order status reply flow"), with order arrows, on/off switches, edit and delete, Add a rule and the "Test a message" box.

**When to use:** Use to show how one channel routes to different agents and flows.

**Slots people usually change:** `text_muted_foreground` (text, e.g. "Rules are checked from top to "), `text_sm` (text, e.g. "When a message arrives in #war"), `text_sm_2` (text, e.g. "When a message arrives in #sal"), `text_sm_3` (text, e.g. "When any message arrives, send"), `text_micro_2` (text, e.g. "See which rule matches"), `font_medium_2` (text, e.g. "Test a message"). All 33 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-routing-rules"`; 23 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-routing-rules.button-1`, `huf-gateway-routing-rules.button-2`, `huf-gateway-routing-rules.button-3`).

**Render:** `node tools/render.mjs huf-gateway-routing-rules --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways/slack-northwind` with fixtures [base, agents, whatsapp, gateway].
