# Knowledge source settings sheet (details, available to agents, advanced, danger zone)  `huf-knowledge-settings`

Right-hand settings sheet of "Northwind Support Handbook": name, description, "Available to agents" switch, collapsed Advanced section and the Delete danger zone.

**When to use:** Use for configuration close-ups.

**Slots people usually change:** `text_steel_2` (text, e.g. "When on, agents you attach thi"), `resize_y` (text, e.g. "Policies, price lists and how-"), `text_steel` (text, e.g. "Helps you and your team rememb"), `text_steel_4` (text, e.g. "Removes all 18 documents. This"), `text_muted_foreground_2` (text, e.g. "Name and description for this "), `text_muted_foreground` (text, e.g. "Northwind Support Handbook"). All 21 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-settings"`; 7 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-settings.button-1`, `huf-knowledge-settings.name`, `huf-knowledge-settings.textarea-2`).

**Render:** `node tools/render.mjs huf-knowledge-settings --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Support%20Handbook` with fixtures [base, agents, knowledge].
