# Role editor, custom role Support Lead (description + capability picker)  `huf-roles-edit`

Role editor for the custom role "Support Lead": name (locked), description and the capability multi-select with the granted capabilities shown as chips; Save changes.

**When to use:** System roles open the same page read-only with a lock.

**Slots people usually change:** `tracking_wide_2` (number, e.g. "11"), `role_description` (text, e.g. "Runs the support desk: sees ev"), `text_steel_7` (text, e.g. "Capabilities determine which p"), `text_steel_6` (text, e.g. "Choose what people with this r"), `text_steel_3` (text, e.g. "Edit this role’s description a"), `text_steel_5` (text, e.g. "Role names cannot be changed a"). All 75 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-roles-edit"`; 32 interactive elements with measured boxes in `measurements.json` (e.g. `huf-roles-edit.link-1`, `huf-roles-edit.link-2`, `huf-roles-edit.link-3`).

**Render:** `node tools/render.mjs huf-roles-edit --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/roles/Support%20Lead` with fixtures [base, agents, settings].
