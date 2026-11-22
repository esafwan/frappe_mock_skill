# Chat with the conversation analytics pane (tokens, cost, current context window)  `huf-context-analytics`

Conversation analytics pane next to the chat: Totals (runs, billed input, output, cost, cache read/write, average duration) and Current context (largest turn, context window, context fullness, this turn, composition by system/history/knowledge/tools/user).

**When to use:** Use for context-window and cost stories; numbers in data/huf/chat.json (analytics).

**Slots people usually change:** `text_ink_12` (number, e.g. "200,000"), `text_ink_4` (number, e.g. "41,280"), `text_ink_6` (currency, e.g. "$0.184"), `text_ink_7` (number, e.g. "18,400"), `text_ink_11` (number, e.g. "14,820"), `text_ink_23` (number, e.g. "16,680"). All 139 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-context-analytics"`; 32 interactive elements with measured boxes in `measurements.json` (e.g. `huf-context-analytics.button-1`, `huf-context-analytics.link-2`, `huf-context-analytics.link-3`).

**Render:** `node tools/render.mjs huf-context-analytics --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/CONV-0001?pane=analytics` with fixtures [base, chat].
