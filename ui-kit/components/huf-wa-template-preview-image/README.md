# WhatsApp message preview with an image header  `huf-wa-template-preview-image`

Message preview with an image header (fictional Northwind spring-range banner), body, footer and two buttons.

**When to use:** The image is a kit asset (assets/); swap it by replacing the file or the img slot.

**Slots people usually change:** `time` (time, e.g. "09:00"), `body_1_7` (text, e.g. "at the Rotterdam showroom. Try"), `body_1_3` (text, e.g. ", you are invited to our"), `footer` (text, e.g. "Reply STOP to opt out"), `body_1_6` (text, e.g. "Thursday 12 March"), `body_1_4` (text, e.g. "spring tasting"). All 13 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-template-preview-image"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-wa-template-preview-image --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
