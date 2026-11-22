# Chat conversation with a report artifact (Q4 sales orders over $5,000)  `huf-artifacts-report`

HUF chat app (Claude-style chat shell): left rail (Dashboard, New, Projects, Artifacts, Scheduled, Recents, user), header with agent switcher and model, transcript and composer (attach, model, voice note, call, send). Sales Analyst conversation: question, render_frappe_view tool row, short answer and an inline frappe-report artifact card (title, Preview/Source tabs, copy, download, fullscreen, filters, sortable table). The header shows the analytics and artifact-pane toggles.

**When to use:** Fictional Northwind Trading data from data/huf/chat.json.

**Slots people usually change:** `text_ink_4` (date, e.g. "2025-10-14"), `text_ink_8` (date, e.g. "2025-10-29"), `text_ink_12` (date, e.g. "2025-11-12"), `text_ink_16` (date, e.g. "2025-11-27"), `text_ink_20` (date, e.g. "2025-12-09"), `text_ink_24` (date, e.g. "2025-12-18"). All 92 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-artifacts-report"`; 44 interactive elements with measured boxes in `measurements.json` (e.g. `huf-artifacts-report.button-1`, `huf-artifacts-report.link-2`, `huf-artifacts-report.link-3`).

**Render:** `node tools/render.mjs huf-artifacts-report --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/CONV-0002` with fixtures [base, chat].
