# URY admin master list (Table)  `ury-admin-screen-master-list`

Schema-driven master list: the Table master from data/schemas/table.json inside the admin shell. Full-bleed toolbar (view toggle, search, Edit Layout, Add Table), a DataTable of tables with shape and status badges, and the SideDrawer form (512px card over a blurred scrim) in the open variants.

**When to use:** Use for any admin master doctype list that edits through a drawer (Table, Room, Menu). Column and field labels are the schema titles; the toolbar search follows the master-list pattern, the source TablePage itself has no search box.

**Slots people usually change:** `e_text` (text, e.g. "Add dining tables to configure"), `e_title` (text, e.g. "No Dining Tables Configured"), `f_layout` (text, e.g. "Advanced Layout Position"), `s_printer` (text, e.g. "Printer Configuration"), `company` (text, e.g. "Bay Leaf Hospitality"), `ask_hint` (text, e.g. "Ask about tonight…"). All 106 slots are in `slots.json`.

**States:** default (none), hover (props), focus (props), drawer-add (props), drawer-edit (props), grid-view (props), searching (props), row-hover (props), empty (props), loading (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-admin-screen-master-list"`; 48 interactive elements with measured boxes in `measurements.json` (e.g. `ury-admin-header.logo`, `ury-admin-header.ask`, `ury-admin-header.company`).

**Render:** `node tools/render.mjs ury-admin-screen-master-list --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/admin-shell.css, ury-v16/components/admin-masters.css from `tokens/css/` and the desk icon sprite (inlined in preview).
