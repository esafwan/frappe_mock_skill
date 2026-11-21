# URY admin Reports home  `ury-admin-screen-reports-home`

Reports landing screen at 1440x900 inside the admin shell with the Reports group open: the four reportsRegistry groups (Sales Summary 8, Customers & Items 5, Employees & Operations 4, Financial 1) as sections of link cards with the registry icons.

**When to use:** Shown when no report is chosen (the live route redirects to Today's Sales). Arabic comes from ury/translations/ar.csv; "Amount", the item, group, branch and breakup names and the sample dates are translated here because ar.csv has no usable entry. "# Orders" and "% of Total" are hard-coded English in the source and stay English. Header cells follow data-table.tsx (12px/500 text-tertiary).

**Slots people usually change:** `rh_desc` (text, e.g. "Select a report from the sideb"), `r_item_hist` (text, e.g. "Item-wise Purchase History"), `r_cust_daywise` (text, e.g. "Daywise Customer Details"), `r_emp_item` (text, e.g. "Employee Item Wise Sales"), `rg_employees` (text, e.g. "Employees & Operations"), `r_work_orders` (text, e.g. "Completed Work Orders"). All 62 slots are in `slots.json`.

**States:** default (none), hover (props), card-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-reports-home"`; 63 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-screen-reports-home --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-reports.css from `tokens/css/` and the desk icon sprite (inlined in preview).
