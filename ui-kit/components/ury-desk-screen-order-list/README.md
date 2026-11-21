# URY desk order list  `ury-desk-screen-order-list`

URY desk Orders page as the POS Invoice list: 30px rows, status indicator badges from pos_invoice_list.js (Paid, Consolidated, Draft, Unpaid, Partly Paid), Customer / Company / Grand Total columns, quick filters from the doctype json.

**When to use:** Starting frame for order screens in the URY v16 desk; the variant shows the URY Order doctype list.

**Slots people usually change:** `gt_0` (currency, e.g. "AED 128.50"), `gt_3` (currency, e.g. "AED 210.00"), `gt_5` (currency, e.g. "AED 164.00"), `gt_1` (currency, e.g. "AED 86.00"), `gt_2` (currency, e.g. "AED 54.25"), `gt_4` (currency, e.g. "AED 47.75"). All 211 slots are in `slots.json`.

**States:** default (none), ury-order (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-screen-order-list"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-screen-order-list --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, frappe-report.css, theme-vars.css, ury-v16/components/desk-nav.css, ury-v16/components/desk-views.css from `tokens/css/` and the desk icon sprite (inlined in preview).
