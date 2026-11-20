# Run agent step panel (Setup tab: agent picker, prompt with data chips, preview)  `huf-flow-panel-agent`

Right-hand step panel of the builder for a Run agent step: header (Write the reply, Run agent, more and close), Ready status strip, Setup/Test/Settings tabs, Which agent picker (Order Status Bot), What to tell it with inline data chips and + Use data, help text and "What this will become" preview.

**When to use:** Use for close-ups of configuring a step; swap the agent and prompt text through slots.

**Slots people usually change:** `break_words_5` (text, e.g. "Write the task as you would to"), `break_words_6` (text, e.g. "You are Harbor Goods support. "), `break_words_8` (text, e.g. "Later steps find this step's d"), `break_words` (text, e.g. "The AI agent that does the wor"), `break_words_7` (text, e.g. "Only people editing the flow s"), `flex_1` (text, e.g. "You are Harbor Goods support. "). All 55 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-panel-agent"`; 17 interactive elements with measured boxes in `measurements.json` (e.g. `huf-flow-panel-agent.div-1`, `huf-flow-panel-agent.input-2`, `huf-flow-panel-agent.div-3`).

**Render:** `node tools/render.mjs huf-flow-panel-agent --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/pre-develop/FlowCanvasPageWrapper-Fd0xVSp_.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows/whatsapp-order-desk` with fixtures [base, flows, agents].
