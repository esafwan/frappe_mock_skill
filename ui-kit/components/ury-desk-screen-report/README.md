# URY desk report  `ury-desk-screen-report`

Today's Sales query report (ury/report/today's_sales): Branch filter and the seven query columns (Today, Total Invoices, Item Total, Total Taxes and Charges, Grand Total, Round Off, Cash Discounts) in the Frappe datatable.

**When to use:** Use for sales-reporting scenes; the variant shows the script report RevPASH.

**Slots people usually change:** `rv_item_total_0` (currency, e.g. "AED 4,812.50"), `rv_grand_total_0` (currency, e.g. "AED 5,053.13"), `rv_Total_Revenue_0` (currency, e.g. "AED 5,053.13"), `rv_Total_Revenue_1` (currency, e.g. "AED 6,120.00"), `rv_Total_Revenue_2` (currency, e.g. "AED 5,480.25"), `rv_Total_Revenue_3` (currency, e.g. "AED 4,390.00"). All 189 slots are in `slots.json`.

**States:** default (none), revpash (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-screen-report"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-screen-report --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, frappe-report.css, theme-vars.css, ury-v16/components/desk-nav.css, ury-v16/components/desk-views.css from `tokens/css/` and the desk icon sprite (inlined in preview).
