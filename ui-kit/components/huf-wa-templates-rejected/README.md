# WhatsApp templates page, rejected template selected (reason + WhatsApp suggestion)  `huf-wa-templates-rejected`

Channels app, WhatsApp > Templates for the fictional supplier Northwind Trading: channel rail with number picker, template list (search, status/category/language filters, status and quality badges) and the rejected "weekend_flash_deal" template open, with the red "Why it was not approved" note and WhatsApp's suggestion.

**When to use:** Establishing shot for any WhatsApp template story; text comes from data/huf/whatsapp.json.

**Slots people usually change:** `text_steel_21` (relative-time, e.g. "15 h ago"), `text_steel_31` (time, e.g. "09:00"), `text_steel_22` (text, e.g. "Check variables are numbered i"), `text_steel_24` (text, e.g. "Add a sample value for every v"), `text_ink_9` (text, e.g. "WhatsApp did not approve this "), `text_ink_10` (text, e.g. "The template does not follow W"). All 110 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-templates-rejected"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-templates-rejected.button-1`, `huf-wa-templates-rejected.link-2`, `huf-wa-templates-rejected.link-3`).

**Render:** `node tools/render.mjs huf-wa-templates-rejected --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates/TPL-0004` with fixtures [base, whatsapp].
