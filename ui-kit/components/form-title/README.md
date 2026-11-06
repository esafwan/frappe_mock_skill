# Form title, status indicator and actions  `form-title`

Form page head with title, status indicator pill, prev/next and Save.

**When to use:** Use for form scenes; change the status text/colour class for Draft/Paid/Overdue.

**Slots people usually change:** `menu_item_label_9` (text, e.g. "Actions > Get Customer Group D"), `dropdown_item_9` (text, e.g. "Get Customer Group Details"), `menu_item_label` (text, e.g. "View > Accounts Receivable"), `menu_item_label_2` (text, e.g. "View > Accounting Ledger"), `menu_item_label_6` (text, e.g. "Create > Payment Entry"), `menu_item_label_7` (text, e.g. "Create > Pricing Rule"). All 104 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr), loading (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="form-title"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `form-title.title`, `form-title.link-2`, `form-title.status`).

**Render:** `node tools/render.mjs form-title --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
