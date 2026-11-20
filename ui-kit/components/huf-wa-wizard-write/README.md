# Template wizard step 2: write it (filled, live preview)  `huf-wa-wizard-write`

Channels app, WhatsApp > Templates > New template wizard (3 steps: Pick a type, Write it, Check and send). Step 2 filled: name and language, text header, body with two variables and their samples, footer; the live preview updates as you type.

**When to use:** Full 1440x900 page; the message preview on the right is the same TemplatePreview captured as huf-wa-template-preview.

**Slots people usually change:** `text_steel_39` (time, e.g. "09:00"), `text_steel_19` (number, e.g. "1024"), `text_steel_8` (number, e.g. "512"), `text_steel_17` (number, e.g. "129"), `text_steel_6` (number, e.g. "21"), `text_steel_13` (number, e.g. "27"). All 150 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-wizard-write"`; 53 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-wizard-write.button-1`, `huf-wa-wizard-write.link-2`, `huf-wa-wizard-write.link-3`).

**Render:** `node tools/render.mjs huf-wa-wizard-write --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
