# Alert banner (form message)  `alert`

Inline form alert banner (form message).

**When to use:** Use for warnings and info on top of a form.

**Slots people usually change:** `div` (text, e.g. "This customer has unpaid invoi"). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="alert"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs alert --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
