# Chat projects, none yet  `huf-chat-projects-empty`

HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). Projects page with no projects and an empty rail.

**When to use:** Fictional Northwind Trading data from data/huf/chat.json.

**Slots people usually change:** `text_pretty` (text, e.g. "Projects group related convers"), `sr_only` (text, e.g. "Collapse conversation rail"), `text_steel_soft` (text, e.g. "No conversations yet"), `text_ink_2` (text, e.g. "No projects yet"), `text_13px` (text, e.g. "Maya Fernandes"), `hover_bg_chat_row_hover` (text, e.g. "Dashboard"). All 16 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-projects-empty"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-projects-empty.button-1`, `huf-chat-projects-empty.link-2`, `huf-chat-projects-empty.link-3`).

**Render:** `node tools/render.mjs huf-chat-projects-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/projects?demo=empty` with fixtures [base, chat].
