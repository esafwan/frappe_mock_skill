# Chat, new conversation with a drafted message in the composer  `huf-chat-empty-drafted`

HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). Cold start with a typed question in the composer; the send button turns solid.

**When to use:** Fictional Northwind Trading data from data/huf/chat.json.

**Slots people usually change:** `disabled_opacity_50` (text, e.g. "Which supplier orders are late"), `text_steel` (text, e.g. "Routes each question to the ri"), `text_steel_soft_3` (text, e.g. "AI output can be inaccurate. D"), `truncate_15` (text, e.g. "Draft a restock email for our "), `truncate_14` (text, e.g. "Summarise yesterday's customer"), `truncate_13` (text, e.g. "Which supplier orders are late"). All 38 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-empty-drafted"`; 28 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-empty-drafted.button-1`, `huf-chat-empty-drafted.link-2`, `huf-chat-empty-drafted.link-3`).

**Render:** `node tools/render.mjs huf-chat-empty-drafted --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat` with fixtures [base, chat].
