# Form tabs  `form-tabs`

Form tab strip.

**When to use:** Use above form sections when the DocType has tabs.

**Slots people usually change:** `nav_link` (text, e.g. "Address & Contact"), `nav_link_6` (text, e.g. "Portal Users"), `nav_link_8` (text, e.g. "Connections"), `nav_link_2` (text, e.g. "Accounting"), `nav_link_5` (text, e.g. "Sales Team"), `nav_link_7` (text, e.g. "More Info"). All 9 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="form-tabs"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `form-tabs.button-1`, `form-tabs.button-2`, `form-tabs.button-3`).

**Render:** `node tools/render.mjs form-tabs --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
