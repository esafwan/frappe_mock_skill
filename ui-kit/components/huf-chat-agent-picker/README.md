# Chat agent switcher (open): agents grouped by provider with model  `huf-chat-agent-picker`

The agent switcher popover from the chat header: search field, agents grouped by provider (Anthropic, OpenAI) with coloured initials avatar, name, model and a check on the current agent.

**When to use:** Radix portal captured on its own; place it under the header agent name (top-left of the chat area) when composing.

**Slots people usually change:** `text_steel_soft_2` (text, e.g. "claude-sonnet-4-5"), `text_steel_soft_3` (text, e.g. "claude-sonnet-4-5"), `text_13px_5` (text, e.g. "Returns Assistant"), `text_13px` (text, e.g. "Hub Orchestrator"), `text_13px_4` (text, e.g. "Order Status Bot"), `text_13px_2` (text, e.g. "Supplier Desk"). All 18 slots are in `slots.json`.

**States:** default (none), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-agent-picker"`; 7 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-agent-picker.div-1`, `huf-chat-agent-picker.search`, `huf-chat-agent-picker.button-2`).

**Render:** `node tools/render.mjs huf-chat-agent-picker --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat` with fixtures [base, chat].
