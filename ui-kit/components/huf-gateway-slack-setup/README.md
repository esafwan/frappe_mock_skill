# Slack setup card (manifest, keys, connection checks, test message)  `huf-gateway-slack-setup`

Slack setup guide: 1 create the Slack app from the manifest, 2 add your keys, 3 check the connection (eight checks, one recommendation), 4 send a test message.

**When to use:** Use for "connect Slack in minutes".

**Slots people usually change:** `text_muted_foreground_2` (text, e.g. "Install the app to your worksp"), `text_muted_foreground_10` (text, e.g. "Channels shared with other org"), `space_y_0_5` (text, e.g. "Set the access policy to Open "), `text_muted_foreground` (text, e.g. "Copy the app manifest, then cr"), `text_muted_foreground_9` (text, e.g. "Direct messages are not open, "), `text_muted_foreground_11` (text, e.g. "Huf will send a direct message"). All 35 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-gateway-slack-setup"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `huf-gateway-slack-setup.button-1`, `huf-gateway-slack-setup.link-2`, `huf-gateway-slack-setup.button-3`).

**Render:** `node tools/render.mjs huf-gateway-slack-setup --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/gateways/slack-northwind` with fixtures [base, agents, whatsapp, gateway].
