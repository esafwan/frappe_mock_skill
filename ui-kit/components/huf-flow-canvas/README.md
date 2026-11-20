# Flow builder canvas, nothing selected (header, node rail, reactflow graph with branches, minimap, empty settings panel)  `huf-flow-canvas`

Visual flow builder for "Harbor Goods - WhatsApp order desk": WhatsApp trigger -> Look up their orders -> Asking about an order? (Yes/No) -> Write the reply / Answer from help center -> Check before sending (Approved/Rejected) -> End steps. Header with Saved, undo/redo, Runs, Settings, Run test, Draft and Publish; left node rail; zoom controls and minimap; right panel hint "Select a step or a connection".

**When to use:** Edges are the app's SVG paths with arrowheads and Yes/No/Approved/Rejected pills; nodes keep the fit-view positions. Use as the establishing shot of the builder.

**Slots people usually change:** `sr_only_2` (text, e.g. "This flow has a chat-message t"), `text_muted_foreground_2` (text, e.g. "Click a step on the canvas to "), `react_flow_node_focus_visible_z_1000_4` (text, e.g. "Press enter or space to select"), `react_flow_node_focus_visible_z_1000_2` (text, e.g. "You can then use the arrow key"), `text_muted_foreground` (text, e.g. "Select a step or a connection "), `react_flow_node_focus_visible_z_1000_3` (text, e.g. "Press delete to remove it and "). All 180 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-canvas"`; 70 interactive elements with measured boxes in `measurements.json` (e.g. `huf-flow-canvas.link-1`, `huf-flow-canvas.link-2`, `huf-flow-canvas.link-3`).

**Render:** `node tools/render.mjs huf-flow-canvas --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/pre-develop/FlowCanvasPageWrapper-Fd0xVSp_.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows/whatsapp-order-desk` with fixtures [base, flows, agents].
