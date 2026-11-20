# Knowledge source page, ready (status sentence, ask field, document ledger with mixed formats and origins)  `huf-knowledge-source`

Source page for "Northwind Support Handbook": "Ready · 18 documents · used by 2 agents", ask field, and a ledger of PDF, XLSX, DOCX, PPTX, URL, TXT, MD and HTML documents from uploads, S3, a web page and typed text.

**When to use:** Main establishing shot of a knowledge source; cut to huf-knowledge-ask for the answer.

**Slots people usually change:** `md_block_2` (relative-time, e.g. "17 hours ago"), `md_block_4` (relative-time, e.g. "17 hours ago"), `md_block_6` (relative-time, e.g. "17 hours ago"), `md_block_8` (relative-time, e.g. "17 hours ago"), `md_block_10` (relative-time, e.g. "17 hours ago"), `md_block_16` (relative-time, e.g. "2 days ago"). All 215 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-source"`; 67 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-source.link-1`, `huf-knowledge-source.link-2`, `huf-knowledge-source.link-3`).

**Render:** `node tools/render.mjs huf-knowledge-source --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Support%20Handbook` with fixtures [base, agents, knowledge].
