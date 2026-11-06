# Field: Text Editor  `field-text-editor`

Rich text editor field with toolbar.

**When to use:** Use for descriptions and notes.

**Slots people usually change:** `text_extra_muted` (text, e.g. "Help: To link to another recor"), `control_label` (text, e.g. "Content"), `tooltip_content` (text, e.g. "content"). All 136 slots are in `slots.json`.

**States:** default (none), focus (css-pseudo), disabled (class-attr), error (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="field-text-editor"`; 21 interactive elements with measured boxes in `measurements.json` (e.g. `field-text-editor.span-1`, `field-text-editor.span-11`, `field-text-editor.button-36`).

**Render:** `node tools/render.mjs field-text-editor --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
