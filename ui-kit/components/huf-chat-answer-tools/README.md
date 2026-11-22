# Chat conversation with the tool group expanded (3 tool calls with results)  `huf-chat-answer-tools`

HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). Same conversation with "Ran 3 tools" open: numbered rows with status dot, tool name and a one-line result summary.

**When to use:** Fictional Northwind Trading data from data/huf/chat.json.

**Slots people usually change:** `font_semibold` (number, e.g. "10"), `last_child_mb_0` (text, e.g. "Which Casa Rinaldi orders are "), `text_muted_foreground_7` (text, e.g. "{"contact": "Giulia Rinaldi", "), `last_child_mb_0_2` (text, e.g. "Two Casa Rinaldi purchase orde"), `text_muted_foreground_3` (text, e.g. "{"results": 3, "top": "§4.2 La"), `p_inline_6` (text, e.g. "A third late order this quarte"). All 79 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-chat-answer-tools"`; 33 interactive elements with measured boxes in `measurements.json` (e.g. `huf-chat-answer-tools.button-1`, `huf-chat-answer-tools.link-2`, `huf-chat-answer-tools.link-3`).

**Render:** `node tools/render.mjs huf-chat-answer-tools --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/CONV-0001` with fixtures [base, chat].
