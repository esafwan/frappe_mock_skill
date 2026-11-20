# New role, filled (Warehouse Planner)  `huf-roles-new`

New role form filled with "Warehouse Planner": name, description and capability picker.

**When to use:** undefined

**Slots people usually change:** `text_steel_7` (text, e.g. "Capabilities determine which p"), `min_h_90px` (text, e.g. "Plans restocks and purchase or"), `text_steel_5` (text, e.g. "A unique name for this role. T"), `text_steel_3` (text, e.g. "Create a new role and choose t"), `text_steel_6` (text, e.g. "Choose what people with this r"), `text_steel_4` (text, e.g. "Name and describe this role"). All 66 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-roles-new"`; 29 interactive elements with measured boxes in `measurements.json` (e.g. `huf-roles-new.link-1`, `huf-roles-new.link-2`, `huf-roles-new.link-3`).

**Render:** `node tools/render.mjs huf-roles-new --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/roles/new` with fixtures [base, agents, settings].
