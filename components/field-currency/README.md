# Field: Currency  `field-currency`

Currency field.

**When to use:** Use for rates and amounts; swap currency via tools/render.mjs --currency.

**Slots people usually change:** `bold` (currency, e.g. "₹ 0.00"), `tooltip_content` (text, e.g. "price_list_rate"), `reqd` (text, e.g. "Rate"). All 3 slots are in `slots.json`.

**States:** default (none), focus (css-pseudo), active (css-pseudo), disabled (class-attr), error (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="field-currency"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `field-currency.input-1`).

**Render:** `node tools/render.mjs field-currency --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
