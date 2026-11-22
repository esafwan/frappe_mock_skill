# New agent: name typed and a template picked  `huf-agent-new-template`

New agent create flow with name filled and the Customer support template applied.

**When to use:** undefined

**Slots people usually change:** `disabled_opacity_50` (text, e.g. "You are a friendly customer su"), `text_steel_3` (text, e.g. "Describe what it should do. Yo"), `text_steel_4` (text, e.g. "Tell it who it helps and how t"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `hover_text_ink_3` (text, e.g. "Internal helpdesk"), `text_ui_text_2` (text, e.g. "Create and try it"). All 71 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-agent-new-template"`; 34 interactive elements with measured boxes in `measurements.json` (e.g. `huf-agent-new-template.link-1`, `huf-agent-new-template.link-2`, `huf-agent-new-template.link-3`).

**Render:** `node tools/render.mjs huf-agent-new-template --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/new` with fixtures [base, agents, agents-editor].
