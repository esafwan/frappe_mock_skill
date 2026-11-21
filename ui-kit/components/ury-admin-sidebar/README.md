# URY admin sidebar  `ury-admin-sidebar`

Navigation rail: DayStatusCard, Plan / Operate / Observe / Control groups, a Reports disclosure and a Setup disclosure pinned to the bottom. 232px expanded, 64px collapsed; the active link is a raised card chip with a primary-coloured icon.

**When to use:** Left of every admin screen. Show the collapsed and Reports-open variants for those states. Arabic comes from ury/translations/ar.csv; "Plan", "Setup", the sample company, branch and department names and the sample date are translated here because ar.csv has no entry for them.

**Slots people usually change:** `r_item_hist` (text, e.g. "Item-wise Purchase History"), `r_cust_daywise` (text, e.g. "Daywise Customer Details"), `r_emp_item` (text, e.g. "Employee Item Wise Sales"), `rg_employees` (text, e.g. "Employees & Operations"), `r_work_orders` (text, e.g. "Completed Work Orders"), `s_printer` (text, e.g. "Printer Configuration"). All 67 slots are in `slots.json`.

**States:** default (none), hover (props), collapsed (props), reports-open (props), setup-open (props), link-hover (props), collapsed-reports (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-sidebar"`; 20 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-sidebar.toggle`, `ury-admin-sidebar.group.plan`, `ury-admin-sidebar.link.sales-plan`).

**Render:** `node tools/render.mjs ury-admin-sidebar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
