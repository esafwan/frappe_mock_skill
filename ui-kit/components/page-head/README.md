# Page head with primary and secondary buttons  `page-head`

Page header: title/breadcrumbs, list-view switcher, menu button and the primary action button.

**When to use:** Use above any list; primary vs secondary button styles live here.

**Slots people usually change:** `menu_item_label_4` (text, e.g. "Role Permissions Manager"), `menu_item_label_8` (text, e.g. "Customize Quick Filters"), `menu_item_label_16` (text, e.g. "Apply Assignment Rule"), `menu_item_label_11` (text, e.g. "Copy to Clipboard"), `menu_item_label_3` (text, e.g. "User Permissions"), `menu_item_label_15` (text, e.g. "Clear Assignment"). All 55 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr), loading (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="page-head"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `page-head.button-4`, `page-head.button-5`, `page-head.menu`).

**Render:** `node tools/render.mjs page-head --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
