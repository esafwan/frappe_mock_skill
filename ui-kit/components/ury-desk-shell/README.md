# URY desk shell  `ury-desk-shell`

1440x900 URY desk composition: pinned dock, 224px sidebar, the top navbar with search, notifications and avatar, and an empty page head.

**When to use:** Starting frame for the URY desk screens; pass the page content to deskShell(active, mainHtml).

**Slots people usually change:** `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"), `nav_s11_11` (text, e.g. "Branch Operating Schedule"), `nav_navbar_search` (text, e.g. "Search or type a command"), `nav_s3_5` (text, e.g. "Table Turnaround Delay"), `nav_s3_7` (text, e.g. "Cost Variance Snapshot"). All 118 slots are in `slots.json`.

**States:** default (none), home (props), reports (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-shell"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-shell --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-nav.css from `tokens/css/` and the desk icon sprite (inlined in preview).
