# Modal dialog  `modal-dialog`

Confirm/message modal dialog.

**When to use:** Use for confirm-delete, prompts and msgprint scenes.

**Slots people usually change:** `frappe_confirm_message` (text, e.g. "Are you sure you want to delet"), `modal_title` (text, e.g. "Confirm"), `es_button_label_2` (text, e.g. "Yes"), `es_button_label` (text, e.g. "No"). All 8 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr), loading (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="modal-dialog"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `modal-dialog.button-2`, `modal-dialog.button-3`, `modal-dialog.button-4`).

**Render:** `node tools/render.mjs modal-dialog --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
