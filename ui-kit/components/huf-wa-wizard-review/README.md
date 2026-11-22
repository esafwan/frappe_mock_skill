# Template wizard step 3: check and send (ready to submit)  `huf-wa-wizard-review`

Channels app, WhatsApp > Templates > New template wizard (3 steps: Pick a type, Write it, Check and send). Step 3: summary (type, name and language, header, body, footer, buttons, samples), "Ready to send" check and "Submit to WhatsApp".

**When to use:** Full 1440x900 page; the message preview on the right is the same TemplatePreview captured as huf-wa-template-preview.

**Slots people usually change:** `text_steel_20` (time, e.g. "09:00"), `whitespace_pre_wrap` (text, e.g. "Hi {{1}}, you are invited to o"), `text_steel_17` (text, e.g. "Meta usually reviews in a few "), `text_ink_17` (text, e.g. "at the Rotterdam showroom. Try"), `text_steel_4` (text, e.g. "Review the template, then send"), `text_steel_18` (text, e.g. "Samples are only used for revi"). All 83 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-wizard-review"`; 20 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-wizard-review.button-1`, `huf-wa-wizard-review.link-2`, `huf-wa-wizard-review.link-3`).

**Render:** `node tools/render.mjs huf-wa-wizard-review --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
