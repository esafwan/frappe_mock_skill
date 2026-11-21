# URY admin data table  `ury-admin-data-table`

Report DataTable: rounded-lg border, bg-muted/50 header row (12px/500 text-tertiary), 12.5px body rows on hairline dividers, numeric columns end-aligned with tabular numerals, and a bold totals row. Row tone washes mark danger, warning or selected rows.

**When to use:** Use for every report and list grid in the admin app; the totals row is added when a report sums its rows. Arabic comes from ury/translations/ar.csv; "Amount", the item, group, branch and breakup names and the sample dates are translated here because ar.csv has no usable entry. "# Orders" and "% of Total" are hard-coded English in the source and stay English. Header cells follow data-table.tsx (12px/500 text-tertiary).

**Slots people usually change:** `dt_0_2` (currency, e.g. "AED 10,140.50"), `dt_f2` (currency, e.g. "AED 18,522.00"), `dt_1_2` (currency, e.g. "AED 5,760.00"), `dt_2_2` (currency, e.g. "AED 2,621.50"), `dt_empty` (text, e.g. "No results found."), `dt_h0` (text, e.g. "Order Type"). All 22 slots are in `slots.json`.

**States:** default (none), hover (props), loading (props), empty (props), row-hover (props), row-tones (props), no-footer (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-data-table"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-admin-data-table --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-reports.css from `tokens/css/` and the desk icon sprite (inlined in preview).
