# Menu dropdown  `menu-dropdown`

Open “⋯” menu dropdown.

**When to use:** Use to show actions (Duplicate, Print, Email …).

**Slots people usually change:** `menu_item_label_9` (text, e.g. "Actions > Get Customer Group D"), `menu_item_label` (text, e.g. "View > Accounts Receivable"), `menu_item_label_2` (text, e.g. "View > Accounting Ledger"), `menu_item_label_6` (text, e.g. "Create > Payment Entry"), `menu_item_label_7` (text, e.g. "Create > Pricing Rule"), `menu_item_label_8` (text, e.g. "Create > Bank Account"). All 37 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="menu-dropdown"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `menu-dropdown.toggle`).

**Render:** `node tools/render.mjs menu-dropdown --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
