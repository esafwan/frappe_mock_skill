# URY admin filter bar  `ury-admin-filter-bar`

Sticky report filter bar: date range trigger, branch select and an order-type multiselect with removable chips, on a bg-background/95 blurred strip with a bottom border and px 24 py 8.

**When to use:** Place directly under the report PageHeader. Built from the UryDateRangePicker trigger, SearchableSelect and MultiSelect class lists. Arabic comes from ury/translations/ar.csv; "Amount", the item, group, branch and breakup names and the sample dates are translated here because ar.csv has no usable entry. "# Orders" and "% of Total" are hard-coded English in the source and stay English. Header cells follow data-table.tsx (12px/500 text-tertiary).

**Slots people usually change:** `fb_range` (text, e.g. "Nov 21, 2026 - Nov 21, 2026"), `branch` (text, e.g. "Marina Branch"), `sm_all_branches` (text, e.g. "All Branches"), `fb_chip1` (text, e.g. "Take Away"), `fb_chip0` (text, e.g. "Dine In"), `fb_ph` (text, e.g. "Select"). All 6 slots are in `slots.json`.

**States:** default (none), hover (props), multi-empty (props), all-branches (props), date-hover (props), branch-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-filter-bar"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-filter-bar.date`).

**Render:** `node tools/render.mjs ury-admin-filter-bar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-reports.css from `tokens/css/` and the desk icon sprite (inlined in preview).
