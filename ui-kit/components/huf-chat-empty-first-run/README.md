# Chat, first run (no conversations yet)  `huf-chat-empty-first-run`

HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). First visit: "No conversations yet" in Recents, Hub Orchestrator hero with starters.

**When to use:** Fictional Northwind Trading data from data/huf/chat.json.

**Slots people usually change:** `text_steel` (text, e.g. "Routes each question to the ri"), `text_steel_soft_5` (text, e.g. "AI output can be inaccurate. D"), `truncate_3` (text, e.g. "Draft a restock email for our "), `truncate_2` (text, e.g. "Summarise yesterday's customer"), `truncate` (text, e.g. "Which supplier orders are late"), `sr_only` (text, e.g. "Collapse conversation rail"). All 30 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-empty-first-run"`; 18 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-empty-first-run.button-1`, `huf-chat-empty-first-run.link-2`, `huf-chat-empty-first-run.link-3`).

**Render:** `node tools/render.mjs huf-chat-empty-first-run --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat?demo=empty` with fixtures [base, chat].
