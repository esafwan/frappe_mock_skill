# URY desk screen: Operate  `ury-desk-screen-operate`

Operate overview workspace (ury_operate.json): Frequently used shortcuts, a spacer, then the link cards Kitchen and Billing, Floor and Service and Settings.

**When to use:** Opened from Operate > Overview in the sidebar.

**Slots people usually change:** `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"), `nav_s11_11` (text, e.g. "Branch Operating Schedule"), `nav_navbar_search` (text, e.g. "Search or type a command"), `nav_s3_5` (text, e.g. "Table Turnaround Delay"), `nav_s3_7` (text, e.g. "Cost Variance Snapshot"). All 137 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-screen-operate"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-screen-operate --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-nav.css, ury-v16/components/desk-workspace.css from `tokens/css/` and the desk icon sprite (inlined in preview).
