# URY admin Daily P&L  `ury-admin-screen-daily-pnl`

Daily P&L at 1440x900 inside the admin shell with the Reports group open: branch and date selects, four KPI figures and the P&L Statement waterfall with grouped breakup rows, subtotals and highlighted headline rows; the sample day is a small loss day (about -8% of sales): Gross Profit takes the success tint with a plus sign and Net Profit the destructive tint with a minus sign, glued to the amount. Negatives use one U+2212 minus everywhere. The Daily P&L report card keeps the registry IndianRupee icon (reportsRegistry.ts) for fidelity.

**When to use:** The statement runs below the fold; the main area scrolls. Arabic comes from ury/translations/ar.csv; "Amount", the item, group, branch and breakup names and the sample dates are translated here because ar.csv has no usable entry. "# Orders" and "% of Total" are hard-coded English in the source and stay English. Header cells follow data-table.tsx (12px/500 text-tertiary).

**Slots people usually change:** `pl_kgs` (currency, e.g. "AED 18,450.00"), `pl_kns` (currency, e.g. "AED 17,355.90"), `pl_a1` (currency, e.g. "AED 18,450.00"), `pl_a4` (currency, e.g. "AED 17,355.90"), `plL_kgs` (currency, e.g. "AED 9,860.00"), `plL_kns` (currency, e.g. "AED 9,260.00"). All 180 slots are in `slots.json`.

**States:** default (none), profit-day (props), empty (props), loading (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-daily-pnl"`; 45 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-screen-daily-pnl --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-reports.css from `tokens/css/` and the desk icon sprite (inlined in preview).
