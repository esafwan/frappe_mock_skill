# Broadcast wizard step 1: template (filled)  `huf-wa-broadcast-wizard`

Channels app, WhatsApp > Broadcasts > New broadcast (5 steps: Template, Recipients, Consent, Preview, Confirm). Step 1 filled: title, approved marketing template, default for {{1}}, header image link and "Send via".

**When to use:** Establishing shot for a broadcast/campaign story; data in data/huf/whatsapp.json (broadcast).

**Slots people usually change:** `text_steel_18` (text, e.g. "The Marketing Messages API use"), `text_steel_17` (text, e.g. "Marketing messages are billed "), `font_medium_4` (text, e.g. "Template variables (defaults f"), `font_medium_7` (text, e.g. "Header image link (https)"), `w_full_5` (text, e.g. "Cloud API (messages)"), `font_medium_3` (text, e.g. "Approved template"). All 77 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-broadcast-wizard"`; 22 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-broadcast-wizard.button-1`, `huf-wa-broadcast-wizard.link-2`, `huf-wa-broadcast-wizard.link-3`).

**Render:** `node tools/render.mjs huf-wa-broadcast-wizard --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/broadcasts/new` with fixtures [base, whatsapp].
