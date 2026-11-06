# Toast (show_alert)  `toast`

Toast / desk alert shown after an action.

**When to use:** Use for success/failure feedback; change message and indicator class.

**Slots people usually change:** `es_toast_message` (text, e.g. "Customer saved"). All 2 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="toast"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `toast.button-1`).

**Render:** `node tools/render.mjs toast --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
