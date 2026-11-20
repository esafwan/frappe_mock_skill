# Add content dialog, Upload files tab with staged files (PDF, Excel, Word, PowerPoint)  `huf-knowledge-add-content`

Add content dialog for "Northwind Support Handbook": tabs Upload files / Web page / Text / Connect storage, drop zone and six staged files with sizes, footer "Add 6 files".

**When to use:** Use to show how documents get into a knowledge source; pair with huf-knowledge-import-progress.

**Slots people usually change:** `text_steel_soft_2` (number, e.g. "50"), `text_muted_foreground` (text, e.g. "Add documents so your agents c"), `text_steel_soft` (text, e.g. "PDF, Word, PowerPoint, Excel, "), `tracking_tight_2` (text, e.g. "to "Northwind Support Handbook"), `text_sm` (text, e.g. "Drop files anywhere here, or"), `text_steel_soft_3` (text, e.g. "MB each · a .zip is unpacked"). All 33 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-add-content"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-add-content.div-1`, `huf-knowledge-add-content.button-2`, `huf-knowledge-add-content.button-3`).

**Render:** `node tools/render.mjs huf-knowledge-add-content --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Support%20Handbook` with fixtures [base, agents, knowledge].
