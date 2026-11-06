# Field: Select  `field-select`

Select field.

**When to use:** Use for enumerations (Customer Type, Status).

**Slots people usually change:** `reqd` (text, e.g. "Customer Type"), `tooltip_content` (text, e.g. "customer_type"), `bold_3` (text, e.g. "Partnership"), `bold_2` (text, e.g. "Individual"), `bold` (text, e.g. "Company"), `bold_4` (text, e.g. "Company"). All 9 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), disabled (class-attr), error (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="field-select"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `field-select.select-1`).

**Render:** `node tools/render.mjs field-select --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
