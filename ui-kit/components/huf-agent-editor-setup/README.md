# Agent editor, Setup tab (instructions, basics, model) with the Try it panel  `huf-agent-editor-setup`

Full agent editor on the Setup tab: header with status and model chip, tabs, instructions card, and the Try it panel with starter prompts.

**When to use:** Use as the establishing shot for editing an agent.

**Slots people usually change:** `text_steel_soft_2` (relative-time, e.g. "8 mins ago"), `text_steel_soft_4` (number, e.g. "5120"), `resize_y` (text, e.g. "You are the Northwind Trading "), `text_steel_3` (text, e.g. "Tell it what to do, who it tal"), `min_w_0` (text, e.g. "This model is not available fo"), `resize_y_2` (text, e.g. "Answers where-is-my-order ques"). All 138 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-agent-editor-setup"`; 60 interactive elements with measured boxes in `measurements.json` (e.g. `huf-agent-editor-setup.link-1`, `huf-agent-editor-setup.link-2`, `huf-agent-editor-setup.link-3`).

**Render:** `node tools/render.mjs huf-agent-editor-setup --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot` with fixtures [base, agents, agents-editor].
