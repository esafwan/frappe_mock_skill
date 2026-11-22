# Agent settings: conversation data and memory switches  `huf-context-memory`

Agent editor > Advanced > Developer options: conversation data management (allow + inject into prompt), Enable memory with the memory search / write tools, and Show tool execution details.

**When to use:** Long-term memory and per-conversation data are HUF's other context-management levers; values in data/huf/chat.json (advanced).

**Slots people usually change:** `text_steel` (text, e.g. "Let the agent store and read d"), `text_steel_2` (text, e.g. "Include stored conversation da"), `text_steel_4` (text, e.g. "Show each tool call and its re"), `text_steel_3` (text, e.g. "Long-term, scoped memory for t"), `text_ink_2` (text, e.g. "Inject conversation data into "), `text_ink` (text, e.g. "Allow conversation data manage"). All 16 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-context-memory"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `huf-context-memory.note-1`, `huf-context-memory.button-1`, `huf-context-memory.input-2`).

**Render:** `node tools/render.mjs huf-context-memory --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot#advanced` with fixtures [base, agents, agents-editor, chat].
