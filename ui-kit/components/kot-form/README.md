# KOT form (kitchen order ticket document)  `kot-form`

A single Kitchen Order Ticket document (items, quantities, production unit, status).

**When to use:** Use to show what the kitchen receives for an order.

**Slots people usually change:** `bold` (date, e.g. "22-10-2026"), `like_disabled_input_3` (time, e.g. "12:11:12"), `like_disabled_input_7` (time, e.g. "12:17:43"), `like_disabled_input_9` (number, e.g. "28"), `control_label_9` (text, e.g. "Start Time For Preparation"), `visually_hidden` (text, e.g. "Begin typing for results."). All 106 slots are in `slots.json`.

**States:** default (none), hover (class-attr), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="kot-form"`; 13 interactive elements with measured boxes in `measurements.json` (e.g. `kot-form.input-7`, `kot-form.link-11`, `kot-form.link-12`).

**Render:** `node tools/render.mjs kot-form --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
