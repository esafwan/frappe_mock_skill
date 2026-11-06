# Field: Check  `field-check`

Check (checkbox) field.

**When to use:** Use for boolean flags.

**Slots people usually change:** `frappe_card_description` (text, e.g. "Disabled items cannot be selec"), `label_area` (text, e.g. "Disabled"), `tooltip_content` (text, e.g. "disabled"). All 3 slots are in `slots.json`.

**States:** default (none), focus (css-pseudo), active (css-pseudo), disabled (class-attr), error (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="field-check"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `field-check.input-1`, `field-check.svg-3`).

**Render:** `node tools/render.mjs field-check --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
