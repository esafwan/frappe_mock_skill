# URY admin master form (Branch)  `ury-admin-screen-master-form`

Branch master detail form (BranchPage) inside the admin shell: Back / title / Save header, then one card with Branch Info, Fiscal & Operational Identification (data/schemas/branch.json fields plus Default Tax Template) and Menu sections.

**When to use:** Use as the pattern for a sectioned master form: icon-chip section headers, two-column grid, required marks, disabled read-only mode.

**Slots people usually change:** `s_fiscal` (text, e.g. "Fiscal & Operational Identific"), `b_menu` (text, e.g. "Default Menu (Active Menu)"), `b_agg` (text, e.g. "Aggregator Series Prefix"), `s_printer` (text, e.g. "Printer Configuration"), `b_inv` (text, e.g. "Invoice Series Prefix"), `company` (text, e.g. "Bay Leaf Hospitality"). All 75 slots are in `slots.json`.

**States:** default (none), focus (props), view-mode (props), field-focus (props), saving (props), disabled (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-master-form"`; 47 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-screen-master-form --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-masters.css from `tokens/css/` and the desk icon sprite (inlined in preview).
