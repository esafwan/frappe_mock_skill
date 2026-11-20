# WhatsApp message preview, media carousel (2 cards)  `huf-wa-template-preview-carousel`

Message preview of a marketing media carousel: intro bubble plus two product cards, each with image, text and a reply button.

**When to use:** Card images are fictional kit assets.

**Slots people usually change:** `time` (time, e.g. "09:00"), `body_1_3` (text, e.g. ", two new suppliers joined Nor"), `card_body_1` (text, e.g. "Bronze-cut pasta from Casa Rin"), `card_body_3` (text, e.g. "Smoked paprika and 30 more spi"), `card_body_4` (text, e.g. "Order spices"), `card_body_2` (text, e.g. "Order pasta"). All 11 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-template-preview-carousel"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-wa-template-preview-carousel --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
