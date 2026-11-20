# Flow node card (Run agent step: icon well, title, ready dot, in/out handles)  `huf-flow-node`

One builder step card (236 x 100): rounded white card, 28 px icon well with the Run agent glyph, title, green "Ready" status dot, dark connection handles at top and bottom.

**When to use:** Compose custom graphs from it or use it for close-ups; change text via slots (node_title); the status dot reads its aria-label.

**Slots people usually change:** `text_muted_foreground` (text, e.g. "Ask Order Status Bot"), `node_title` (text, e.g. "Write the reply"), `truncate` (text, e.g. "Ready"). All 5 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-node"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-flow-node --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/pre-develop/FlowCanvasPageWrapper-Fd0xVSp_.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows/whatsapp-order-desk` with fixtures [base, flows, agents].
