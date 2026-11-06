# Field: Data  `field-data`

Data (text) field.

**When to use:** Use for names, codes, short text.

**Slots people usually change:** `reqd` (text, e.g. "Customer Name"), `tooltip_content` (text, e.g. "customer_name"), `bold` (text, e.g. "Direct"). All 4 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), disabled (class-attr), error (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="field-data"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `field-data.input-1`).

**Render:** `node tools/render.mjs field-data --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
