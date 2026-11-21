# URY admin Sales Plan  `ury-admin-screen-sales-plan`

SalesPlanPage inside the admin shell: PageHeader with date, enforcement mode, Save Draft and the next lifecycle action, the four-step lifecycle stepper with its summary, KPI strip, item search, the sticky Jump-to bar and department groups (Kitchen open with an editable Plan column, Bar and Bakery collapsed).

**When to use:** Show the status variants to document each stepper stage. The Plan column inputs are compact Inputs; the table uses fixed column widths to approximate the auto layout.

**Slots people usually change:** `sp_desc` (text, e.g. "We've suggested quantities bas"), `sum_canc` (text, e.g. "Currently: Superseded/Cancelle"), `sum_lock` (text, e.g. "Currently: Ready for Productio"), `sum_appr` (text, e.g. "Currently: Approval · Next: Lo"), `sum_prop` (text, e.g. "Currently: Review · Next: Subm"), `sp_search` (text, e.g. "Search item, department, or pr"). All 111 slots are in `slots.json`.

**States:** default (none), hover (props), review (props), approval (props), disabled (props), approved (props), locked (props), cancelled (props), blocked (props), pill-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-sales-plan"`; 30 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-screen-sales-plan --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-masters.css from `tokens/css/` and the desk icon sprite (inlined in preview).
