# Batch job dialog, failed (provider error message)  `huf-batch-job-failed`

Batch job dialog for a failed Product Description Refresh batch with the provider error in plain words.

**When to use:** Use for the "what went wrong" beat.

**Slots people usually change:** `text_ink_4` (relative-time, e.g. "2 days ago"), `text_ink_5` (relative-time, e.g. "2 days ago"), `text_ink_3` (number, e.g. "480"), `text_destructive` (text, e.g. "The provider rejected the batc"), `text_muted_foreground` (text, e.g. "Product Description Refresh"), `text_ink` (text, e.g. "Product Description Refresh"). All 17 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-batch-job-failed"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `huf-batch-job-failed.button-1`).

**Render:** `node tools/render.mjs huf-batch-job-failed --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/batch-jobs` with fixtures [base, tools].
