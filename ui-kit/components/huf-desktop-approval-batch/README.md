# Approval panel: batch of four requests from one run  `huf-desktop-approval-batch`

The approval panel with four pending requests from one agent run (two file writes, one edit, one command) and the batch Allow all / Deny all row.

**When to use:** Same window as huf-desktop-approval.

**Slots people usually change:** `text_var_steel_21` (text, e.g. "python3 scripts/score_supplier"), `text_var_ink` (text, e.g. "Save the Q4 supplier review as"), `text_var_ink_2` (text, e.g. "outputs/supplier-review-q4.doc"), `agent_and_chat_2` (text, e.g. "- Supplier delivery review, Q4"), `text_var_steel_9` (text, e.g. "outputs/supplier-review-q4.pdf"), `text_var_steel_15` (text, e.g. "data/reorder_points.csv"). All 52 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-approval-batch"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-approval-batch.button-1`, `huf-desktop-approval-batch.button-2`, `huf-desktop-approval-batch.button-3`).

**Render:** `node tools/render.mjs huf-desktop-approval-batch --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `approval/index.html` with fixtures [base].
