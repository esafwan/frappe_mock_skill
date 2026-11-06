# KOT list (URY Kitchen Order Tickets)  `kot-list`

KOT list: every kitchen order ticket with status, production unit and time.

**When to use:** Use for kitchen / KOT list scenes in the desk.

**Slots people usually change:** `ellipsis_3` (date, e.g. "22-10-2026"), `ellipsis_6` (date, e.g. "22-10-2026"), `ellipsis_9` (date, e.g. "22-10-2026"), `ellipsis_12` (date, e.g. "22-10-2026"), `ellipsis_15` (date, e.g. "22-10-2026"), `ellipsis_18` (date, e.g. "22-10-2026"). All 447 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="kot-list"`; 114 interactive elements with measured boxes in `measurements.json` (e.g. `kot-list.input-1`, `kot-list.button-2`, `kot-list.input-3`).

**Render:** `node tools/render.mjs kot-list --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
