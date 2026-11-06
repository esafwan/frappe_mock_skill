# Field: Link with awesomplete dropdown  `field-link`

Link field with the open awesomplete suggestion list.

**When to use:** Use when demonstrating link search/autocomplete.

**Slots people usually change:** `visually_hidden` (text, e.g. "Begin typing for results."), `control_label` (text, e.g. "Customer Group"), `tooltip_content` (text, e.g. "customer_group"), `hide` (text, e.g. "Government"). All 9 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), disabled (class-attr), error (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="field-link"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `field-link.input-1`).

**Render:** `node tools/render.mjs field-link --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
