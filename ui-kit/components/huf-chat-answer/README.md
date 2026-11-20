# Chat conversation: question, tool group (collapsed) and grounded answer with table and numbered sources  `huf-chat-answer`

HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). Supplier Desk conversation: user bubble, "Ran 3 tools" row (search_knowledge, list_records, get_record), then a markdown answer with a table of late orders, policy bullets with numbered source links [1] [2] and a Sources list. Citations are markdown links (HUF chat has no dedicated citation chips).

**When to use:** Fictional Northwind Trading data from data/huf/chat.json.

**Slots people usually change:** `table_cell_4` (number, e.g. "10"), `user_message` (text, e.g. "Which Casa Rinaldi orders are "), `last_child_mb_0` (text, e.g. "Two Casa Rinaldi purchase orde"), `p_inline_6` (text, e.g. "A third late order this quarte"), `text_steel_soft_3` (text, e.g. "AI output can be inaccurate. D"), `underline_5` (text, e.g. "Casa Rinaldi framework agreeme"). All 70 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-answer"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-answer.button-1`, `huf-chat-answer.link-2`, `huf-chat-answer.link-3`).

**Render:** `node tools/render.mjs huf-chat-answer --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/CONV-0001` with fixtures [base, chat].
