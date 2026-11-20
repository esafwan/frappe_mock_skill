# Automations list, empty state  `huf-automations-list-empty`

Automations screen with none: "An automation runs an Agent automatically, outside a normal chat" with a New automation action.

**When to use:** Use as the "before" frame.

**Slots people usually change:** `text_pretty` (text, e.g. "An automation runs an Agent au"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `text_steel_2` (text, e.g. "maya@example.com"), `text_ink` (text, e.g. "Maya Fernandes"), `sr_only` (text, e.g. "Toggle sidebar"), `text_ui_text` (text, e.g. "New automation"). All 58 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-automations-list-empty"`; 27 interactive elements with measured boxes in `measurements.json` (e.g. `huf-automations-list-empty.link-1`, `huf-automations-list-empty.link-2`, `huf-automations-list-empty.link-3`).

**Render:** `node tools/render.mjs huf-automations-list-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/automations?demo=empty` with fixtures [base, agents, procedures].
