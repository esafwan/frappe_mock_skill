# Template wizard step 2: empty with validation errors (after Next)  `huf-wa-wizard-write-errors`

Channels app, WhatsApp > Templates > New template wizard (3 steps: Pick a type, Write it, Check and send). Step 2 after pressing Next with nothing filled in: red field messages, Next dimmed, empty preview ("Your message preview appears here as you type.").

**When to use:** Full 1440x900 page; the message preview on the right is the same TemplatePreview captured as huf-wa-template-preview.

**Slots people usually change:** `text_steel_13` (number, e.g. "1024"), `text_steel_7` (number, e.g. "512"), `text_steel_17` (number, e.g. "60"), `text_steel_21` (number, e.g. "10"), `text_steel_18` (text, e.g. "Optional. Up to 10 buttons. Re"), `text_steel_9` (text, e.g. "Switching renames the ones you"). All 95 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-wizard-write-errors"`; 40 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-wizard-write-errors.button-1`, `huf-wa-wizard-write-errors.link-2`, `huf-wa-wizard-write-errors.link-3`).

**Render:** `node tools/render.mjs huf-wa-wizard-write-errors --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
