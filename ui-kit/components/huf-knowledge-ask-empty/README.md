# Ask a question: nothing matched  `huf-knowledge-ask-empty`

Source page after a question with no matching passages: "No passages found." and "Nothing matched. Try different words."

**When to use:** Use for the honest "I do not know" beat.

**Slots people usually change:** `text_steel_3` (text, e.g. "Nothing matched. Try different"), `truncate` (text, e.g. "Northwind Support Handbook"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `min_w_0_5` (text, e.g. "No passages found."), `text_steel_2` (text, e.g. "maya@example.com"), `text_ink` (text, e.g. "Maya Fernandes"). All 67 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-ask-empty"`; 31 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-ask-empty.link-1`, `huf-knowledge-ask-empty.link-2`, `huf-knowledge-ask-empty.link-3`).

**Render:** `node tools/render.mjs huf-knowledge-ask-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Support%20Handbook?demo=noresults` with fixtures [base, agents, knowledge].
