# URY desk screen: URY Home  `ury-desk-screen-home`

URY Home workspace (ury/workspace/ury/ury.json) in the 1440x900 desk shell: Frequently used (6 shortcuts, col-3), Today (7 number cards, col-4) and Trends (4 charts, col-6).

**When to use:** Landing page of the URY app; the two custom blocks (URY POS, POS V1) are not drawn.

**Slots people usually change:** `v_sales` (currency, e.g. "AED 5,053.13"), `v_avg` (currency, e.g. "AED 120.31"), `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"), `nc_unsettled` (text, e.g. "Unsettled Bills (All Open)"), `nav_s11_11` (text, e.g. "Branch Operating Schedule"). All 172 slots are in `slots.json`.

**States:** default (none), charts-scrolled (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-screen-home"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-screen-home --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-nav.css, ury-v16/components/desk-workspace.css from `tokens/css/` and the desk icon sprite (inlined in preview).
