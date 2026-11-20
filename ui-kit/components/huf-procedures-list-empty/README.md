# Procedures list, empty state  `huf-procedures-list-empty`

Procedures screen with no procedures: "No procedures yet" card explaining how to save a chat sequence as a Procedure.

**When to use:** Use as the "before" frame.

**Slots people usually change:** `text_steel_9` (text, e.g. "A Procedure is a sequence of s"), `text_pretty` (text, e.g. "Tell an agent what to do in ch"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `text_ink_2` (text, e.g. "No procedures yet"), `text_steel_2` (text, e.g. "maya@example.com"), `text_ink` (text, e.g. "Maya Fernandes"). All 59 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-procedures-list-empty"`; 25 interactive elements with measured boxes in `measurements.json` (e.g. `huf-procedures-list-empty.link-1`, `huf-procedures-list-empty.link-2`, `huf-procedures-list-empty.link-3`).

**Render:** `node tools/render.mjs huf-procedures-list-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/procedures?demo=empty` with fixtures [base, agents, procedures].
