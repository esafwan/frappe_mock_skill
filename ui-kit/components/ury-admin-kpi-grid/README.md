# URY admin KPI grid  `ury-admin-kpi-grid`

Top of the Service Board (KPIGrid.tsx): two chrome link buttons (POS, Mosaic) over a KpiStrip of four live metrics: Today's Sales (success tone), Orders Today, Avg. Order Value and Active Tables. KpiStrip is borderless: 11px label, 25px/600 tabular value, hairline dividers and a border-b. Money values are typed currency slots. Arabic comes from ury/translations/ar.csv; payment-mode names (Cash, Card, Online, Wallet), the "Wallet" and sample customer, menu-item and invoice names, "POS", the action button captions and the toast have no ar.csv entry and are translated here (the toast text is an English literal in the source and stays English).

**When to use:** Use as the headline stats of the admin dashboard; the stat-cards variant is the boxed StatCard form used for toned metrics with deltas.

**Slots people usually change:** `kv_sales` (currency, e.g. "AED 18,640.00"), `kv_sales_aed` (currency, e.g. "AED 18,640.00"), `kv_sales_usd` (currency, e.g. "USD 1,250.00"), `kv_avg` (currency, e.g. "AED 145.63"), `kv_avg_aed` (currency, e.g. "AED 145.63"), `kv_avg_usd` (currency, e.g. "USD 62.50"). All 24 slots are in `slots.json`.

**States:** default (none), stat-cards (props), stat-cards-full (props), floor-full (props), warning (props), mixed-currency (props), loading (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-kpi-grid"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-kpi-grid.link-pos`, `ury-admin-kpi-grid.link-mosaic`).

**Render:** `node tools/render.mjs ury-admin-kpi-grid --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
