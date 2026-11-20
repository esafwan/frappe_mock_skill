# Agent settings: Limits (context strategy Summarize, history limit, max turns, knowledge and tool budgets)  `huf-context-limits`

Agent editor > Advanced > Limits card: "When a conversation gets long" (Summarize / FIFO / None), history limit, max turns, max knowledge tokens and max context characters.

**When to use:** Values in data/huf/chat.json (advanced), layered over the Order Status Bot agent.

**Slots people usually change:** `text_steel_2` (text, e.g. "Summarize compresses old messa"), `text_steel` (text, e.g. "Caps on how long a run and a c"), `text_steel_6` (text, e.g. "Tool results are truncated bey"), `text_steel_4` (text, e.g. "Consecutive actions in one run"), `text_steel_5` (text, e.g. "Budget for injected knowledge."), `font_medium` (text, e.g. "When a conversation gets long"). All 27 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-context-limits"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `huf-context-limits.button-1`, `huf-context-limits.select-2`, `huf-context-limits.history-1`).

**Render:** `node tools/render.mjs huf-context-limits --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot#advanced` with fixtures [base, agents, agents-editor, chat].
