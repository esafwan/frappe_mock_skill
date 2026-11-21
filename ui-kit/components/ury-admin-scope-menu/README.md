# URY admin scope menu  `ury-admin-scope-menu`

Company and branch dropdown opened from the header: 256px card, rounded-lg, shadow-lg, an uppercase title, an All row, a divider and the list; the selected row is primary-tint with a check.

**When to use:** Place under the header scope buttons (end-aligned, 8px gap) when a scope menu is open. Arabic comes from ury/translations/ar.csv; "Plan", "Setup", the sample company, branch and department names and the sample date are translated here because ar.csv has no entry for them.

**Slots people usually change:** `sm_title_company` (text, e.g. "Select Active Company"), `sm_c1` (text, e.g. "Bay Leaf Hospitality"), `sm_title_branch` (text, e.g. "Select Active Branch"), `sm_c2` (text, e.g. "Saffron Table Group"), `sm_b3` (text, e.g. "Airport Road Branch"), `sm_c3` (text, e.g. "Harbour Kitchens"). All 10 slots are in `slots.json`.

**States:** default (none), hover (props), company-selected (props), branch-all (props), branch-selected (props), item-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-scope-menu"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-scope-menu.all`, `ury-admin-scope-menu.item-0`, `ury-admin-scope-menu.item-1`).

**Render:** `node tools/render.mjs ury-admin-scope-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
