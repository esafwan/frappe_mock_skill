# URY desk number card  `ury-desk-number-card`

URY number card: .widget.number-widget-box with a 13px ink-gray-5 title and a 17px semibold value, padding 8 8 8 12; the card menu stays hidden until hover.

**When to use:** Use for single metrics on a workspace (the URY cards are Sum, Count and Average of POS Invoice, URY KOT and URY Wastage; none shows percentage stats by default).

**Slots people usually change:** `v_sales` (currency, e.g. "AED 5,053.13"), `nc_cancel` (text, e.g. "Cancelled Bills Today"), `d_label` (text, e.g. "vs yesterday"), `nc_sales` (text, e.g. "Sales Today"), `nc_bills` (text, e.g. "Bills Today"), `d_up` (text, e.g. "12.5%"). All 9 slots are in `slots.json`.

**States:** default (none), currency (props), count (props), percentage-up (props), percentage-down (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-desk-number-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-desk-number-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, theme-vars.css, ury-v16/components/desk-workspace.css from `tokens/css/` and the desk icon sprite (inlined in preview).
