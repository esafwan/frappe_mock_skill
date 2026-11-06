# Dashboard number card  `number-card`

Dashboard number card.

**When to use:** Use for KPIs; change the number, label and delta.

**Slots people usually change:** `number` (number, e.g. "131"), `percentage_stat_area` (text, e.g. "0 % since yesterday"), `ellipsis` (text, e.g. "Open Work Orders"), `dropdown_item` (text, e.g. "Refresh"), `dropdown_item_2` (text, e.g. "Edit"), `pull_right` (text, e.g. "..."). All 7 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="number-card"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `number-card.link-1`).

**Render:** `node tools/render.mjs number-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
