# Run viewer, waiting for approval (decision card with Approve / Reject)  `huf-flow-run-viewer-waiting`

Run #43 paused at "Check before sending": Waiting for approval pill and headline, "Your decision is needed" card with the approval message, waiting time, green Approve and red Reject buttons, then the steps so far. The canvas behind marks the waiting step.

**When to use:** Use for the human-in-the-loop beat of a flow story.

**Slots people usually change:** `whitespace_pre_wrap_3` (number, e.g. "+15550100877"), `whitespace_pre_wrap_11` (number, e.g. "+15550100877"), `sr_only_2` (text, e.g. "This flow has a chat-message t"), `text_muted_foreground_2` (text, e.g. "Click a step on the canvas to "), `whitespace_pre_wrap_8` (text, e.g. "Hi Daniel, order HG-10517 is s"), `react_flow_node_focus_visible_z_1000_4` (text, e.g. "Press enter or space to select"). All 277 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-run-viewer-waiting"`; 83 interactive elements with measured boxes in `measurements.json` (e.g. `huf-flow-run-viewer-waiting.link-1`, `huf-flow-run-viewer-waiting.link-2`, `huf-flow-run-viewer-waiting.link-3`).

**Render:** `node tools/render.mjs huf-flow-run-viewer-waiting --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/pre-develop/FlowCanvasPageWrapper-Fd0xVSp_.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows/whatsapp-order-desk?run=FR-0043` with fixtures [base, flows, agents].
