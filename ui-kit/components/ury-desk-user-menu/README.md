# URY desk user menu  `ury-desk-user-menu`

The sidebar user menu (frappe.ui.Dropdown, side top, align start): My Space, Settings, Manage Dock, Reload, then a rule and Logout, opened above the user chip.

**When to use:** Use on any desk page without a pinned dock; with a dock the avatar at its foot opens the same menu.

**Slots people usually change:** `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"), `nav_s11_11` (text, e.g. "Branch Operating Schedule"), `nav_s3_5` (text, e.g. "Table Turnaround Delay"), `nav_s3_7` (text, e.g. "Cost Variance Snapshot"), `nav_s1_3` (text, e.g. "Item Production Setup"). All 117 slots are in `slots.json`.

**States:** default (none), highlight (props), closed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-user-menu"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-sidebar.header`, `ury-desk-sidebar.user`, `ury-desk-sidebar.arrow`).

**Render:** `node tools/render.mjs ury-desk-user-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-overlays.css from `tokens/css/` and the desk icon sprite (inlined in preview).
