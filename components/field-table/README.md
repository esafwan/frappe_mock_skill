# Field: Table with rows  `field-table`

Child table (grid) with rows.

**When to use:** Use for line items.

**Slots people usually change:** `reqd_3` (currency, e.g. "₹ 524.70"), `reqd_4` (currency, e.g. "₹ 524.70"), `reqd_5` (currency, e.g. "₹ 316.80"), `reqd_6` (currency, e.g. "₹ 316.80"), `ellipsis_4` (text, e.g. "SZF: Sizzling Arabian Chicken "), `ellipsis_7` (text, e.g. "GVC: Grilled Veal Chops"). All 37 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="field-table"`; 12 interactive elements with measured boxes in `measurements.json` (e.g. `field-table.input-1`, `field-table.div-2`, `field-table.link-3`).

**Render:** `node tools/render.mjs field-table --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
