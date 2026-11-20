# Template wizard step 1: pick a type (Marketing selected)  `huf-wa-wizard-type`

Channels app, WhatsApp > Templates > New template wizard (3 steps: Pick a type, Write it, Check and send). Step 1 with the Marketing tab: Default (selected), Media carousel and the "Coming soon" kinds, canned preview, "Good for" and "Parts you can change".

**When to use:** Full 1440x900 page; the message preview on the right is the same TemplatePreview captured as huf-wa-template-preview.

**Slots people usually change:** `text_steel_17` (time, e.g. "10:30"), `text_ink_10` (text, e.g. "Hey there! Check out our fresh"), `text_steel_10` (text, e.g. "Show 2 to 10 scrollable cards,"), `text_steel_12` (text, e.g. "Show products from your catalo"), `text_steel_14` (text, e.g. "Collect structured answers, su"), `text_steel_8` (text, e.g. "Send promotions or information"). All 88 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-wizard-type"`; 28 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-wizard-type.button-1`, `huf-wa-wizard-type.link-2`, `huf-wa-wizard-type.link-3`).

**Render:** `node tools/render.mjs huf-wa-wizard-type --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
