# Template wizard step 2: "Add button" menu (open)  `huf-wa-wizard-write-add-button`

The "Add button" dropdown of the template wizard (step 2, Buttons section): Custom reply, Visit website, Call phone number, Copy offer code; kinds WhatsApp no longer allows show the reason in grey.

**When to use:** Radix portal captured on its own (the page behind it is huf-wa-wizard-write); place it under the "Add button" control when composing.

**Slots people usually change:** `menu_item_3` (text, e.g. "Call phone number"), `menu_item_4` (text, e.g. "Copy offer code"), `menu_item_2` (text, e.g. "Visit website"), `menu_item_1` (text, e.g. "Custom reply"). All 4 slots are in `slots.json`.

**States:** default (none), hover (class-attr), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-wa-wizard-write-add-button"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `huf-wa-wizard-write-add-button.div-1`, `huf-wa-wizard-write-add-button.div-2`, `huf-wa-wizard-write-add-button.div-3`).

**Render:** `node tools/render.mjs huf-wa-wizard-write-add-button --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/channels/whatsapp/n/Northwind%20Sales/templates?new=1` with fixtures [base, whatsapp].
