# URY admin screen: Dashboard  `ury-admin-screen-dashboard`

Service Board at 1440x900 inside the admin shell (header, sidebar with the Service Board link at /dashboard active). Page content (max 1440, px 22, pt 20): link cards, KPI strip, then Live POS Transactions in a DataTable. The analytics charts are commented out in DashboardPage.tsx, so the screen omits them; see ury-admin-chart-card. Arabic comes from ury/translations/ar.csv; payment-mode names (Cash, Card, Online, Wallet), the "Wallet" and sample customer, menu-item and invoice names, "POS", the action button captions and the toast have no ar.csv entry and are translated here (the toast text is an English literal in the source and stays English).

**When to use:** The landing page of the admin app after sign-in.

**Slots people usually change:** `kv_sales` (currency, e.g. "AED 18,640.00"), `kv_avg` (currency, e.g. "AED 145.63"), `tx_a1` (currency, e.g. "AED 142.00"), `tx_a2` (currency, e.g. "AED 318.75"), `tx_a4` (currency, e.g. "AED 205.25"), `tx_a7` (currency, e.g. "AED 276.00"). All 103 slots are in `slots.json`.

**States:** default (none), loading (props), floor-full (props), warning (props), empty (props), error (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-dashboard"`; 29 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-screen-dashboard --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
