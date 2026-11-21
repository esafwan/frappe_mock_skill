# URY admin chart card  `ury-admin-chart-card`

AnalyticsCharts cards with the Recharts output redrawn as static SVG (no JS): Sales Trend line (monotone, dots under 20 points), Order Type Split donut, payment bars and the Top Selling Menu Items ranked list. Card is rounded-lg border shadow-sm with the double p-4 gutter of Card + CardHeader/CardContent; title 14px/600 uppercase tracking-wide; chart height 300; colours from CHART_COLORS (blue and violet ramp). Arabic comes from ury/translations/ar.csv; payment-mode names (Cash, Card, Online, Wallet), the "Wallet" and sample customer, menu-item and invoice names, "POS", the action button captions and the toast have no ar.csv entry and are translated here (the toast text is an English literal in the source and stays English).

**When to use:** Place in a grid (lg:grid-cols-2 or 3, gap 24); the 546px width is the two-column cell of the 1116px page.

**Slots people usually change:** `ti_r0` (currency, e.g. "AED 8,370.00"), `ti_r1` (currency, e.g. "AED 5,320.00"), `ti_r2` (currency, e.g. "AED 6,550.00"), `ti_r3` (currency, e.g. "AED 1,180.00"), `ti_r5` (currency, e.g. "AED 1,110.00"), `ti_r4` (currency, e.g. "AED 970.00"). All 56 slots are in `slots.json`.

**States:** default (none), donut (props), payment-bars (props), top-items (props), top-items-empty (props), top-items-loading (props), loading (props), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-chart-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-admin-chart-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
