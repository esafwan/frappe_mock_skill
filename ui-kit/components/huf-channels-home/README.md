# Channels app: WhatsApp number home (healthy)  `huf-channels-home`

Channels app home for the "Northwind Sales" number: channel rail (WhatsApp, Telegram, Slack, Teams, number picker, sections), health banner with Enabled / Credentials / Receiving chips, counters, access token and 24h activity cards, needs attention, quick actions.

**When to use:** Establishing shot for the Channels app; previously crashed under the mocks (fixed by the get_number_summary and list_conversations fixtures).

**Slots people usually change:** `text_steel_5` (relative-time, e.g. "30 min ago"), `text_ink_7` (relative-time, e.g. "30 min ago"), `text_steel_3` (relative-time, e.g. "3 min ago"), `text_ink_12` (relative-time, e.g. "3 min ago"), `text_ink_13` (number, e.g. "214"), `text_ink_3` (number, e.g. "86"). All 94 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-channels-home"`; 24 interactive elements with measured boxes in `measurements.json` (e.g. `huf-channels-home.link-1`, `huf-channels-home.link-2`, `huf-channels-home.link-3`).

**Render:** `node tools/render.mjs huf-channels-home --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/home` with fixtures [base, agents, whatsapp, gateway].
