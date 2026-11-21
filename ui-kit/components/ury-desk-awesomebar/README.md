# URY desk awesomebar  `ury-desk-awesomebar`

The Ctrl+K search modal over the desk shell: .navbar-modal-wrapper with the 28px .awesomebar-input-row, the 1px .modal-divider, the Awesomplete list and the keyboard-hint footer, on the 50% backdrop with shadow-2xl.

**When to use:** Open it from the navbar search button or the dock; frappe renders no group headings, so rows are mixed Go to (List/Workspace) and Report rows in score order.

**Slots people usually change:** `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"), `nav_s11_11` (text, e.g. "Branch Operating Schedule"), `nav_navbar_search` (text, e.g. "Search or type a command"), `nav_s3_5` (text, e.g. "Table Turnaround Delay"), `nav_s3_7` (text, e.g. "Cost Variance Snapshot"). All 127 slots are in `slots.json`.

**States:** default (none), results (props), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-awesomebar"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-awesomebar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-overlays.css from `tokens/css/` and the desk icon sprite (inlined in preview).
