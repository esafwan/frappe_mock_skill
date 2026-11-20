# Desktop chat: tool run summary, document card and answer, composer with workspace / agent / Permissions chips  `huf-desktop-chat`

Huf Desktop main window, chat with a Huf agent (Operations Analyst on the fictional Northwind Trading server): title bar, chat rail (New chat, Projects, Scheduled, Documents, Skills, Recents grouped by day, connection footer), the conversation "Supplier delivery review, Q4": user request, "Ran 4 tools" summary (reads, a command, Create document), the document card with Open, and the agent answer with bullets.

**When to use:** Composer row: workspace folder chip (supplier-ops), agent selector with model, approval-mode Permissions chip (Ask every time). Text comes from data/huf/desktop.json.

**Slots people usually change:** `text_steel_soft_2` (relative-time, e.g. "Yesterday"), `text_steel_soft` (relative-time, e.g. "Today"), `font_semibold_2` (number, e.g. "95.6%"), `font_semibold_3` (number, e.g. "98.1%"), `leading_relaxed_3` (text, e.g. "Lindqvist Fish (91.2%) and Bay"), `leading_relaxed` (text, e.g. "Put together the Q4 supplier d"). All 124 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-chat"`; 49 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-chat.button-1`, `huf-desktop-chat.button-2`, `huf-desktop-chat.button-3`).

**Render:** `node tools/render.mjs huf-desktop-chat --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/chat/NW-CONV-0001` with fixtures [base].
