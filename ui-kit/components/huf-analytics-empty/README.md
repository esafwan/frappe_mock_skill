# Analytics tab, no analytics yet  `huf-analytics-empty`

Analytics tab on a new workspace: "No analytics yet. Analytics accrue as agent runs complete in this window."

**When to use:** Empty state only.

**Slots people usually change:** `text_pretty` (text, e.g. "Analytics accrue as agent runs"), `sm_truncate` (text, e.g. "Totals and trends across your "), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `text_steel_2` (text, e.g. "maya@example.com"), `text_ink_2` (text, e.g. "No analytics yet"), `text_ink` (text, e.g. "Maya Fernandes"). All 62 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-analytics-empty"`; 30 interactive elements with measured boxes in `measurements.json` (e.g. `huf-analytics-empty.link-1`, `huf-analytics-empty.link-2`, `huf-analytics-empty.link-3`).

**Render:** `node tools/render.mjs huf-analytics-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions?tab=analytics&demo=empty` with fixtures [base, agents, audit].
