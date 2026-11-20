# Template wizard step 3 in edit mode (resubmit an approved template)  `huf-wa-wizard-review-edit`

Channels app, WhatsApp > Templates > New template wizard (3 steps: Pick a type, Write it, Check and send). Edit mode of "order_shipped" at step 3: step 1 locked, utility expiry row, "Submit changes to WhatsApp".

**When to use:** Full 1440x900 page; the message preview on the right is the same TemplatePreview captured as huf-wa-template-preview.

**Slots people usually change:** `text_steel_24` (time, e.g. "09:00"), `whitespace_pre_wrap` (text, e.g. "Hi {{1}}, your order of *{{2}}"), `text_steel_20` (text, e.g. "Meta usually reviews in a few "), `text_ink_16` (text, e.g. "left our Rotterdam warehouse t"), `text_steel_4` (text, e.g. "Review your changes. WhatsApp "), `text_steel_21` (text, e.g. "Meta may move a utility templa"). All 90 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-wizard-review-edit"`; 19 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-wizard-review-edit.button-1`, `huf-wa-wizard-review-edit.link-2`, `huf-wa-wizard-review-edit.link-3`).

**Render:** `node tools/render.mjs huf-wa-wizard-review-edit --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?edit=TPL-0001` with fixtures [base, whatsapp].
