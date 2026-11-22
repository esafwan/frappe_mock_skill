# Template wizard step 1: Utility tab selected  `huf-wa-wizard-type-utility`

Channels app, WhatsApp > Templates > New template wizard (3 steps: Pick a type, Write it, Check and send). Step 1 on the Utility tab with Utility · Default selected and the order-update sample preview.

**When to use:** Full 1440x900 page; the message preview on the right is the same TemplatePreview captured as huf-wa-template-preview.

**Slots people usually change:** `text_steel_9` (time, e.g. "10:30"), `text_ink_6` (text, e.g. "Good news! Your order 23KFEJ23"), `text_steel_8` (text, e.g. "Send messages about an existin"), `text_steel_6` (text, e.g. "WhatsApp reviews and prices te"), `hover_underline` (text, e.g. "Start from Meta's template lib"), `text_ink_4` (text, e.g. "What kind of message is it?"). All 69 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-wizard-type-utility"`; 24 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-wizard-type-utility.button-1`, `huf-wa-wizard-type-utility.link-2`, `huf-wa-wizard-type-utility.link-3`).

**Render:** `node tools/render.mjs huf-wa-wizard-type-utility --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
