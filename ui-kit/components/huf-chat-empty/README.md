# Chat, new conversation (Hub Orchestrator cold start with starter prompts, recents filled)  `huf-chat-empty`

HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). Cold start: agent avatar, name and description, three "Try" starter prompts, empty composer.

**When to use:** Fictional Northwind Trading data from data/huf/chat.json.

**Slots people usually change:** `text_steel` (text, e.g. "Routes each question to the ri"), `text_steel_soft_4` (text, e.g. "AI output can be inaccurate. D"), `starter_prompt_3` (text, e.g. "Draft a restock email for our "), `starter_prompt_2` (text, e.g. "Summarise yesterday's customer"), `starter_prompt_1` (text, e.g. "Which supplier orders are late"), `truncate_7` (text, e.g. "Olive oil supplier price chang"). All 41 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-empty"`; 30 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-empty.button-1`, `huf-chat-empty.link-2`, `huf-chat-empty.link-3`).

**Render:** `node tools/render.mjs huf-chat-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat` with fixtures [base, chat].
