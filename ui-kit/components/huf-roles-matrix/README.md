# Roles & access matrix (4 roles x 8 capability groups)  `huf-roles-matrix`

Members > Roles & access: capability matrix comparing the four Northwind roles (Huf Admin, Builder, Viewer and the custom Support Lead) across eight capability groups; collapsed.

**When to use:** System roles carry a lock icon; click a group to reveal the underlying permission keys.

**Slots people usually change:** `group_data_collapsible_icon_hidden_4` (text, e.g. "AI providers & models"), `text_steel` (text, e.g. "maya@example.com"), `group_data_collapsible_icon_hidden_11` (text, e.g. "SSH connections"), `transition_colors_12` (text, e.g. "System settings"), `group_data_collapsible_icon_hidden_10` (text, e.g. "Code execution"), `text_ink` (text, e.g. "Maya Fernandes"). All 70 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-roles-matrix"`; 32 interactive elements with measured boxes in `measurements.json` (e.g. `huf-roles-matrix.button-1`, `huf-roles-matrix.link-2`, `huf-roles-matrix.link-3`).

**Render:** `node tools/render.mjs huf-roles-matrix --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/members?view=roles` with fixtures [base, agents, settings].
