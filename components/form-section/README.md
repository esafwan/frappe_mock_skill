# Form section with columns  `form-section`

A form section card with three columns of fields.

**When to use:** Use as the body of a form scene.

**Slots people usually change:** `visually_hidden` (text, e.g. "Begin typing for results."), `visually_hidden_2` (text, e.g. "Begin typing for results."), `visually_hidden_3` (text, e.g. "Begin typing for results."), `hide_2` (text, e.g. "Rest Of The World"), `control_label_4` (text, e.g. "Customer Group"), `tooltip_content_7` (text, e.g. "customer_group"). All 38 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="form-section"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `form-section.input-1`, `form-section.select-2`, `form-section.input-3`).

**Render:** `node tools/render.mjs form-section --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
