# List view (filters, sort, rows, checkboxes, pagination)  `list-view`

Standard list: filter bar, sort selector, header with select-all, rows with checkboxes and status pills, paging.

**When to use:** Use for any DocType list scene (Customers, Items, Invoices).

**Slots people usually change:** `es_pill_4` (number, e.g. "2500"), `es_pill_2` (number, e.g. "100"), `es_pill_3` (number, e.g. "500"), `es_pill` (number, e.g. "20"), `max_w_sm` (text, e.g. "A company or person you sell g"), `visually_hidden` (text, e.g. "Begin typing for results."). All 423 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="list-view"`; 121 interactive elements with measured boxes in `measurements.json` (e.g. `list-view.input-1`, `list-view.button-2`, `list-view.input-3`).

**Render:** `node tools/render.mjs list-view --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
