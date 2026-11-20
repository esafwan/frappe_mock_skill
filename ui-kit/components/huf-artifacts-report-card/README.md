# Artifact card: frappe report (filters + sortable table)  `huf-artifacts-report-card`

An inline artifact as an agent returns it in chat: header with table icon and title, Preview/Source pill tabs and copy/download/fullscreen actions, then the report: Open in Desk link, filter inputs per column, sortable table and record count.

**When to use:** Rows come from data/huf/chat.json (report.data).

**Slots people usually change:** `cell_3` (date, e.g. "2025-10-14"), `cell_7` (date, e.g. "2025-10-29"), `cell_11` (date, e.g. "2025-11-12"), `cell_15` (date, e.g. "2025-11-27"), `cell_19` (date, e.g. "2025-12-09"), `cell_23` (date, e.g. "2025-12-18"). All 46 slots are in `slots.json`.

**States:** default (none), focus (class-attr), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-artifacts-report-card"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `huf-artifacts-report-card.div-1`, `huf-artifacts-report-card.button-2`, `huf-artifacts-report-card.source`).

**Render:** `node tools/render.mjs huf-artifacts-report-card --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/CONV-0002` with fixtures [base, chat].
