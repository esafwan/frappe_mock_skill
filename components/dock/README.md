# App dock (left icon rail)  `dock`

App dock (left icon rail)

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `dock_item_label_6` (text, e.g. "Manufacturing"), `dock_item_label_2` (text, e.g. "Accounts"), `dock_item_label_7` (text, e.g. "Projects"), `header_title` (text, e.g. "ERPNext"), `dock_item_label_3` (text, e.g. "Selling"), `dock_item_label_9` (text, e.g. "Quality"). All 24 slots are in `slots.json`.

**States:** default (none), hover (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="dock"`; 11 interactive elements with measured boxes in `measurements.json` (e.g. `dock.link-1`, `dock.button-2`, `dock.button-3`).

**Render:** `node tools/render.mjs dock --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
