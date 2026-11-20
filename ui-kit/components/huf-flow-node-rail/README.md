# Builder node rail (48 px: triggers, agent, condition, tools, data)  `huf-flow-node-rail`

The thin left rail of the flow builder: icon buttons that open the step palettes (What starts it, Run agent, Condition, Apps and tools, Data).

**When to use:** Use for a close-up of adding a step.

**Slots people usually change:** none. All 6 slots are in `slots.json`.

**States:** default (none), hover (class-attr), focus (class-attr), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-node-rail"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `huf-flow-node-rail.button-1`, `huf-flow-node-rail.button-2`, `huf-flow-node-rail.button-3`).

**Render:** `node tools/render.mjs huf-flow-node-rail --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/pre-develop/FlowCanvasPageWrapper-Fd0xVSp_.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows/whatsapp-order-desk` with fixtures [base, flows, agents].
