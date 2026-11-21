# URY desk sidebar  `ury-desk-sidebar`

URY v16 desk sidebar: logo header, Search and Notification, Home, the Apps group and the 12 URY sections (Apps, Plan, Operate, Observe, Control, Finance, Purchasing, Staff & Shifts, AI Insights, Analytics, Reports, Setup) with their pages, and the user chip.

**When to use:** Use as the left panel of any URY desk page; beside a pinned dock the dock takes search, notifications, the user chip and the header mark (see ury-desk-shell).

**Slots people usually change:** `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"), `nav_s11_11` (text, e.g. "Branch Operating Schedule"), `nav_s3_5` (text, e.g. "Table Turnaround Delay"), `nav_s3_7` (text, e.g. "Cost Variance Snapshot"), `nav_s1_3` (text, e.g. "Item Production Setup"). All 112 slots are in `slots.json`.

**States:** default (none), expanded (props), home (props), apps-open (props), collapsed (props), edge-hover (props), drawer (props), pos-operations (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-sidebar"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-sidebar.header`, `ury-desk-sidebar.user`, `ury-desk-sidebar.arrow`).

**Render:** `node tools/render.mjs ury-desk-sidebar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-nav.css from `tokens/css/` and the desk icon sprite (inlined in preview).
