# Flow builder with the Run agent step selected (purple node, Setup panel with agent picker and data-chip prompt)  `huf-flow-canvas-step`

Builder with "Write the reply" selected: the node gets the violet selection border and trash button, the right panel shows the Run agent step (Ready, Setup/Test/Settings tabs, Which agent = Order Status Bot, What to tell it with data chips "Sender name · WhatsApp message", "Order no · Look up their orders", "Status · Look up their orders", and the preview "What this will become").

**When to use:** Use after huf-flow-canvas to show configuring a step.

**Slots people usually change:** `sr_only_2` (text, e.g. "This flow has a chat-message t"), `break_words_5` (text, e.g. "Write the task as you would to"), `break_words_6` (text, e.g. "You are Harbor Goods support. "), `react_flow_node_focus_visible_z_1000_4` (text, e.g. "Press enter or space to select"), `break_words_8` (text, e.g. "Later steps find this step's d"), `break_words` (text, e.g. "The AI agent that does the wor"). All 234 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-canvas-step"`; 87 interactive elements with measured boxes in `measurements.json` (e.g. `huf-flow-canvas-step.link-1`, `huf-flow-canvas-step.link-2`, `huf-flow-canvas-step.link-3`).

**Render:** `node tools/render.mjs huf-flow-canvas-step --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/pre-develop/FlowCanvasPageWrapper-Fd0xVSp_.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows/whatsapp-order-desk` with fixtures [base, flows, agents].
