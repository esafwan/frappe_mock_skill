# WhatsApp message preview (text header, body with samples, footer, 2 buttons)  `huf-wa-template-preview`

Live WhatsApp message preview from the template wizard: dotted chat wallpaper, bubble with bold header, body with *bold* formatting and variables filled from samples, footer, time, and the button pills below.

**When to use:** Use for close-ups of "what the customer sees"; change copy via slots (header_text, body, footer, button_label).

**Slots people usually change:** `time` (time, e.g. "09:00"), `body_1_7` (text, e.g. "at the Rotterdam showroom. Try"), `header_text` (text, e.g. "Spring tasting at Northwind"), `body_1_3` (text, e.g. ", you are invited to our"), `footer` (text, e.g. "Reply STOP to opt out"), `body_1_6` (text, e.g. "Thursday 12 March"). All 13 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-template-preview"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-wa-template-preview --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
