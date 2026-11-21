# URY admin setup wizard  `ury-admin-screen-setup-wizard`

Setup wizard full-page card, no admin shell (WizardLayout): header with logo, title and two-step breadcrumb, a Card with the setup form (/setup-wizard/0) or the Configure sidebar and Branch section (/setup-wizard/1), and the sticky footer navigation.

**When to use:** First-run flow after install: Setup collects company, country and installation type; Configure walks branch, rooms, tables, menu, payments and staff.

**Slots people usually change:** `w_chart_d` (text, e.g. "A template for how your income"), `w_fy_d` (text, e.g. "When your financial year start"), `w_abbr_d` (text, e.g. "Used as a short prefix for you"), `w_demo_d` (text, e.g. "Adds a sample branch, rooms, t"), `w_s_desc` (text, e.g. "Set up your main branch name, "), `w_inv_d` (text, e.g. "Shown at the start of every bi"). All 54 slots are in `slots.json`.

**States:** default (none), hover (props), focus (props), configure (props), configure-aggregator (props), advanced-selected (props), demo-on (props), field-focus (props), continue-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-setup-wizard"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-screen-setup-wizard.continue`).

**Render:** `node tools/render.mjs ury-admin-screen-setup-wizard --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-masters.css from `tokens/css/` and the desk icon sprite (inlined in preview).
