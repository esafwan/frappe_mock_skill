# URY admin page toolbar  `ury-admin-page-toolbar`

Full-bleed PageToolbar (breadcrumb, 18px/600 title, view toggle, border-b) followed by the sticky filter bar (bg-background/95 with blur, border-b, px 24 py 8) holding the "Jump to" pills and the Add item button.

**When to use:** First block inside the admin main area. The toolbar punches through the 24px gutter. Arabic comes from ury/translations/ar.csv; "Plan", "Setup", the sample company, branch and department names and the sample date are translated here because ar.csv has no entry for them.

**Slots people usually change:** `pt_title` (text, e.g. "Sales Plan — Fri, 21 Nov · Mar"), `r_today` (text, e.g. "Today's Sales"), `n_sales_plan` (text, e.g. "Sales Plan"), `pt_jump` (text, e.g. "Jump to:"), `pt_add` (text, e.g. "Add item"), `pt_d1` (text, e.g. "Kitchen"). All 10 slots are in `slots.json`.

**States:** default (none), hover (props), no-filter-bar (props), pill-hover (props), reports-route (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-page-toolbar"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-page-toolbar.pill-0`, `ury-admin-page-toolbar.pill-1`, `ury-admin-page-toolbar.pill-2`).

**Render:** `node tools/render.mjs ury-admin-page-toolbar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
