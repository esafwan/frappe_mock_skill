# Form side panel (assignments, tags, shared)  `form-sidebar`

Form side panel (assignments, tags, shared)

**When to use:** Use when a scene needs this element.

**Slots people usually change:** `visually_hidden` (text, e.g. "Begin typing for results."), `modified_by` (text, e.g. "Last Edited By You"), `created_by` (text, e.g. "Created By You"), `explore_link` (text, e.g. "Attachments"), `badge_hover` (text, e.g. "Feedback"), `ellipsis_3` (text, e.g. "Show All"). All 25 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr), loading (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="form-sidebar"`; 7 interactive elements with measured boxes in `measurements.json` (e.g. `form-sidebar.button-2`, `form-sidebar.button-3`, `form-sidebar.button-5`).

**Render:** `node tools/render.mjs form-sidebar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
