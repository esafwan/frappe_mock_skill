# Run viewer, finished run (sheet over the canvas: run #42, outcome, step story; canvas shows the taken path)  `huf-flow-run-viewer`

Run #42 of the WhatsApp order desk opened over the canvas: Finished + "Order update sent" pills, "Run finished in 2 min 50 s", and "What happened" step cards (received WhatsApp message with its data, looked up saved data, checked a condition, asked an agent...). Behind the dimmed overlay the canvas shows "Showing this run" and the taken edges in green, untaken faded.

**When to use:** Use to show what a flow did for one customer message.

**Slots people usually change:** `whitespace_pre_wrap_3` (number, e.g. "+15550100231"), `sr_only_2` (text, e.g. "This flow has a chat-message t"), `text_muted_foreground_2` (text, e.g. "Click a step on the canvas to "), `whitespace_pre_wrap_8` (text, e.g. "Hi Priya, your order HG-10482 "), `whitespace_pre_wrap_9` (text, e.g. "Hi Priya, your order HG-10482 "), `react_flow_node_focus_visible_z_1000_4` (text, e.g. "Press enter or space to select"). All 287 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-run-viewer"`; 82 interactive elements with measured boxes in `measurements.json` (e.g. `huf-flow-run-viewer.link-1`, `huf-flow-run-viewer.link-2`, `huf-flow-run-viewer.link-3`).

**Render:** `node tools/render.mjs huf-flow-run-viewer --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/pre-develop/FlowCanvasPageWrapper-Fd0xVSp_.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows/whatsapp-order-desk?run=FR-0042` with fixtures [base, flows, agents].
