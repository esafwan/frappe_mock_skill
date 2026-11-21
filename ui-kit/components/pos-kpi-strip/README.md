# POS KPI strip  `pos-kpi-strip`

The four-stat strip at the top of the POS Dashboard: Today's Sales, Orders Today, Avg. Order Value and Active Tables, 11px label over a 25px value, hairline dividers, bottom border with 16px padding.

**When to use:** Directly under the Needs Attention feed. Currency stats are currency slots; Active Tables is an LTR-isolated fraction.

**Slots people usually change:** `k1_value` (currency, e.g. "AED 18,420.00"), `k3_value` (currency, e.g. "AED 129.72"), `k3_label` (text, e.g. "Avg. Order Value"), `k1_label` (text, e.g. "Today's Sales"), `k4_label` (text, e.g. "Active Tables"), `k2_label` (text, e.g. "Orders Today"). All 9 slots are in `slots.json`.

**States:** default (none), with-hint (props), loading (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-kpi-strip"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-kpi-strip --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
