# URY desk screen: POS Operations  `ury-desk-screen-pos-operations`

POS Operations workspace (ury/ury/workspace/pos_operations): the five cashier number cards Today's Sales, Today's Bills, Average Bill Value, Open KOTs and Unsettled Bills.

**When to use:** Cashier landing page; the sidebar shows the standard URY desk because the dedicated POS Operations sidebar is a separate module sidebar.

**Slots people usually change:** `pv_sales` (currency, e.g. "AED 5,053.13"), `pv_avg` (currency, e.g. "AED 120.31"), `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"), `nav_s11_11` (text, e.g. "Branch Operating Schedule"), `nav_navbar_search` (text, e.g. "Search or type a command"). All 128 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-screen-pos-operations"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-screen-pos-operations --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-nav.css, ury-v16/components/desk-workspace.css from `tokens/css/` and the desk icon sprite (inlined in preview).
