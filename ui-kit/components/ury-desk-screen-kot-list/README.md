# URY desk Kitchen Orders list  `ury-desk-screen-kot-list`

URY KOT list (workspace shortcut "Kitchen Orders"): ID subject, Order Status badge (Ready For Prepare, Served), Invoice and Date columns, Order Status quick filter.

**When to use:** Use for kitchen-order oversight scenes in the desk.

**Slots people usually change:** `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"), `nav_s11_11` (text, e.g. "Branch Operating Schedule"), `nav_navbar_search` (text, e.g. "Search or type a command"), `nav_s3_5` (text, e.g. "Table Turnaround Delay"), `nav_s3_7` (text, e.g. "Cost Variance Snapshot"). All 179 slots are in `slots.json`.

**States:** default (none), served (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-screen-kot-list"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-screen-kot-list --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, frappe-report.css, theme-vars.css, ury-v16/components/desk-nav.css, ury-v16/components/desk-views.css from `tokens/css/` and the desk icon sprite (inlined in preview).
