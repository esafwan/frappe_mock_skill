# Integrations page (11 connections, two need attention)  `huf-integrations-list`

Settings > Integrations: every connected account (channels and tools such as GitHub, Gmail, Google Calendar/Sheets/Maps, SerpApi) with service logo, status pill, last check, "Use in agent" and "Fix this" / Settings.

**When to use:** Sorted by health, so problems come first.

**Slots people usually change:** `text_steel_soft` (relative-time, e.g. "Checked 15 hours ago"), `text_steel_soft_2` (relative-time, e.g. "Checked 4 hours ago"), `text_steel_soft_3` (relative-time, e.g. "Checked 30 mins ago"), `text_steel_soft_4` (relative-time, e.g. "Checked 15 mins ago"), `text_steel_soft_5` (relative-time, e.g. "Checked 2 hours ago"), `text_steel_soft_7` (relative-time, e.g. "Checked 3 hours ago"). All 111 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-integrations-list"`; 54 interactive elements with measured boxes in `measurements.json` (e.g. `huf-integrations-list.button-1`, `huf-integrations-list.link-2`, `huf-integrations-list.link-3`).

**Render:** `node tools/render.mjs huf-integrations-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/integrations` with fixtures [base, agents, whatsapp, gateway].
