# URY desk order form  `ury-desk-screen-order-form`

URY Order form on the Order tab: Add Item, Grand Total (read only), Additional Details, the Items field-table (URY Order Item: Item, Item Name, Qty, Rate, Comments) and the Waiter / POS Profile / Cashier read-only links.

**When to use:** The URY Printer Settings child table is a field of URY Production Unit (not of URY Order), so it is drawn in the production-unit variant.

**Slots people usually change:** `v_grand_total` (currency, e.g. "AED 86.00"), `g_rate_0` (currency, e.g. "AED 28.00"), `g_rate_1` (currency, e.g. "AED 10.00"), `l_enable_order_type_wise_display_on_mosaic` (text, e.g. "Enable order type wise display"), `nav_s11_12` (text, e.g. "Branch Operating Exception"), `nav_s11_18` (text, e.g. "Fulfilment Posting Intents"). All 175 slots are in `slots.json`.

**States:** default (none), customer (props), unsaved (props), production-unit (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-screen-order-form"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-desk-dock.logo`, `ury-desk-dock.search`, `ury-desk-dock.bell`).

**Render:** `node tools/render.mjs ury-desk-screen-order-form --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, frappe-report.css, theme-vars.css, ury-v16/components/desk-nav.css, ury-v16/components/desk-views.css from `tokens/css/` and the desk icon sprite (inlined in preview).
