# New agent: create card, empty  `huf-agent-new`

New agent create flow, empty.

**When to use:** undefined

**Slots people usually change:** `text_steel_3` (text, e.g. "Describe what it should do. Yo"), `text_steel_4` (text, e.g. "Tell it who it helps and how t"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `hover_text_ink_4` (text, e.g. "Internal helpdesk"), `text_ui_text_2` (text, e.g. "Create and try it"), `text_steel_2` (text, e.g. "maya@example.com"). All 69 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-agent-new"`; 34 interactive elements with measured boxes in `measurements.json` (e.g. `huf-agent-new.link-1`, `huf-agent-new.link-2`, `huf-agent-new.link-3`).

**Render:** `node tools/render.mjs huf-agent-new --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/new` with fixtures [base, agents, agents-editor].
