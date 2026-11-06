# Field: Date  `field-date`

Date field.

**When to use:** Use for posting/due dates.

**Slots people usually change:** `bold` (date, e.g. "01-01-2026"), `reqd` (text, e.g. "Posting Date"), `tooltip_content` (text, e.g. "posting_date"). All 4 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr), error (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="field-date"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `field-date.input-1`).

**Render:** `node tools/render.mjs field-date --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
