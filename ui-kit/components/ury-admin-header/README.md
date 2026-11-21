# URY admin header  `ury-admin-header`

Top bar of the URY admin app: logo, divider, breadcrumb, Ask bar, company and branch scope buttons, Open POS, notifications bell and user menu. 48px tall plus a 1px bottom border, px 24, bg-background.

**When to use:** Use above every admin screen (adminLayout). Arabic comes from ury/translations/ar.csv; "Plan", "Setup", the sample company, branch and department names and the sample date are translated here because ar.csv has no entry for them.

**Slots people usually change:** `company` (text, e.g. "Bay Leaf Hospitality"), `ask_hint` (text, e.g. "Ask about tonight…"), `notif_label` (text, e.g. "Open notifications"), `branch` (text, e.g. "Marina Branch"), `r_today` (text, e.g. "Today's Sales"), `n_sales_plan` (text, e.g. "Sales Plan"). All 14 slots are in `slots.json`.

**States:** default (none), hover (props), no-unread (props), all-scope (props), reports-route (props), company-hover (props), user-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-header"`; 7 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-header --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
