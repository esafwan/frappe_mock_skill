# URY admin Today's Sales report  `ury-admin-screen-report`

Today's Sales report at 1440x900 inside the admin shell with the Reports group open: PageHeader with the Updated time, sticky filter bar, six-figure KPI strip, a Top Selling Items table with totals row, and Prev / Next pagination.

**When to use:** Template for every report page. The filter bar, totals row and pagination are composed from the date-range, MultiSelect, DataTable and pagination patterns used across the Reports pages. Arabic comes from ury/translations/ar.csv; "Amount", the item, group, branch and breakup names and the sample dates are translated here because ar.csv has no usable entry. "# Orders" and "% of Total" are hard-coded English in the source and stay English. Header cells follow data-table.tsx (12px/500 text-tertiary).

**Slots people usually change:** `k_item_v` (currency, e.g. "AED 17,640.00"), `k_grand_v` (currency, e.g. "AED 18,522.00"), `ti_0_3` (currency, e.g. "AED 1,920.00"), `ti_1_3` (currency, e.g. "AED 1,394.00"), `ti_2_3` (currency, e.g. "AED 1,376.00"), `ti_3_3` (currency, e.g. "AED 1,276.00"). All 142 slots are in `slots.json`.

**States:** default (none), hover (props), empty (props), loading (props), row-hover (props), date-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-report"`; 48 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-screen-report --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-reports.css from `tokens/css/` and the desk icon sprite (inlined in preview).
