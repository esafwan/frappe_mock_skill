# Agent editor with the Add knowledge dialog open (source picker)  `huf-agent-editor-knowledge-add`

Add knowledge dialog over the Abilities tab: searchable source picker with health badges and document counts.

**When to use:** undefined

**Slots people usually change:** `text_steel_soft_2` (relative-time, e.g. "8 mins ago"), `text_steel_soft_4` (number, e.g. "5120"), `text_steel_soft_15` (number, e.g. "144"), `text_steel_soft_19` (number, e.g. "112"), `text_steel_soft_6` (number, e.g. "18"), `text_steel_soft_10` (number, e.g. "13"). All 187 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-agent-editor-knowledge-add"`; 83 interactive elements with measured boxes in `measurements.json` (e.g. `huf-agent-editor-knowledge-add.link-2`, `huf-agent-editor-knowledge-add.link-3`, `huf-agent-editor-knowledge-add.link-4`).

**Render:** `node tools/render.mjs huf-agent-editor-knowledge-add --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot#abilities` with fixtures [base, agents, agents-editor].
