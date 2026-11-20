# Chat projects list  `huf-chat-projects`

HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). Projects page: three projects with description and last activity, "+ Project" button.

**When to use:** Fictional Northwind Trading data from data/huf/chat.json.

**Slots people usually change:** `whitespace_nowrap_4` (relative-time, e.g. "21 hours ago"), `whitespace_nowrap_2` (relative-time, e.g. "8 mins ago"), `whitespace_nowrap_6` (relative-time, e.g. "2 days ago"), `text_steel` (text, e.g. "Late orders, credit notes and "), `text_steel_2` (text, e.g. "What sold, what ran out and wh"), `text_steel_3` (text, e.g. "Drafting the new returns and c"). All 36 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-projects"`; 24 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-projects.button-1`, `huf-chat-projects.link-2`, `huf-chat-projects.link-3`).

**Render:** `node tools/render.mjs huf-chat-projects --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/projects` with fixtures [base, chat].
