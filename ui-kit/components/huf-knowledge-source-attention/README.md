# Knowledge source page, needs attention (failed and skipped documents with reasons and Retry)  `huf-knowledge-source-attention`

Source page for "Supplier Contracts" after an S3 import: "3 documents need attention" with Review, filter pills with counts, failed rows with plain-language reasons and Retry, skipped rows.

**When to use:** Use for the "something went wrong, one click fixes it" beat.

**Slots people usually change:** `md_block_2` (relative-time, e.g. "1 day ago"), `md_block_4` (relative-time, e.g. "1 day ago"), `md_block_6` (relative-time, e.g. "1 day ago"), `md_block_8` (relative-time, e.g. "1 day ago"), `md_block_10` (relative-time, e.g. "1 day ago"), `md_block_12` (relative-time, e.g. "1 day ago"). All 195 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-source-attention"`; 66 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-source-attention.link-1`, `huf-knowledge-source-attention.link-2`, `huf-knowledge-source-attention.link-3`).

**Render:** `node tools/render.mjs huf-knowledge-source-attention --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Supplier%20Contracts` with fixtures [base, agents, knowledge].
