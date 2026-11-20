# Knowledge source page while importing (Importing · 58 of 112, progress row, Adding… rows, Skipped 8)  `huf-knowledge-import-progress`

Source page for "Northwind Regional Handbooks" during an S3 import: live "Importing · 58 of 112" header, progress row with View details / Cancel, documents marked "Adding…" and ready rows below.

**When to use:** Use for the background-import beat; the numbers are text slots.

**Slots people usually change:** `md_block_2` (relative-time, e.g. "8 mins ago"), `md_block_4` (relative-time, e.g. "8 mins ago"), `md_block_6` (relative-time, e.g. "8 mins ago"), `md_block_8` (relative-time, e.g. "8 mins ago"), `md_block_10` (relative-time, e.g. "8 mins ago"), `md_block_12` (relative-time, e.g. "8 mins ago"). All 191 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-import-progress"`; 61 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-import-progress.link-1`, `huf-knowledge-import-progress.link-2`, `huf-knowledge-import-progress.link-3`).

**Render:** `node tools/render.mjs huf-knowledge-import-progress --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Regional%20Handbooks` with fixtures [base, agents, knowledge].
