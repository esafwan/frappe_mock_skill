# Batch job dialog, completed (details and results)  `huf-batch-job-detail`

Batch job dialog for a completed Weekly Stock Digest batch: provider, 240 requests, times, estimated cost and a results table (succeeded, failed, tokens).

**When to use:** Use after huf-batch-jobs to show the outcome of one batch.

**Slots people usually change:** `text_ink_4` (relative-time, e.g. "1 day ago"), `text_ink_5` (relative-time, e.g. "1 day ago"), `text_ink_6` (currency, e.g. "$0.4182"), `text_ink_10` (number, e.g. "412880"), `text_ink_11` (number, e.g. "96340"), `text_ink_3` (number, e.g. "240"). All 25 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-batch-job-detail"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `huf-batch-job-detail.button-1`).

**Render:** `node tools/render.mjs huf-batch-job-detail --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/batch-jobs` with fixtures [base, tools].
