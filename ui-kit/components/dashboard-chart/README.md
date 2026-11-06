# Dashboard chart  `dashboard-chart`

Dashboard chart widget (SVG chart).

**When to use:** Use for trend/analytics scenes.

**Slots people usually change:** `dropdown_item_5` (text, e.g. "Work Order Summary Report"), `ellipsis` (text, e.g. "Work Order Analysis"), `dropdown_item_3` (text, e.g. "Reset Chart"), `legend_dataset_label_4` (text, e.g. "Not Started"), `text_extra_muted` (text, e.g. "Loading..."), `legend_dataset_label_5` (text, e.g. "In Process"). All 16 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="dashboard-chart"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `dashboard-chart.button-1`, `dashboard-chart.div-7`).

**Render:** `node tools/render.mjs dashboard-chart --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
