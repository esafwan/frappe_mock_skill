# Procedure detail, write procedure pending review, Test result shown  `huf-procedures-detail-approval`

Procedure detail for a write procedure (Place a supplier restock order): Approval card with Pending Review badge and Request Review / Approve / Reject, then the validation harness result (2 of 3 runs passed, reasons for not promoting).

**When to use:** Shows the safety gate before an agent may change real data.

**Slots people usually change:** `text_sm_6` (relative-time, e.g. "17 hours ago"), `text_steel_18` (relative-time, e.g. "0 months ago"), `text_sm_2` (number, e.g. "1.2"), `overflow_auto` (text, e.g. "{ "nodes": [ { "id": "n1", "ty"), `text_muted_foreground_2` (text, e.g. "This is a write Procedure (I8)"), `text_steel_soft` (text, e.g. "Write means it can change real"). All 113 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-procedures-detail-approval"`; 31 interactive elements with measured boxes in `measurements.json` (e.g. `huf-procedures-detail-approval.link-1`, `huf-procedures-detail-approval.link-2`, `huf-procedures-detail-approval.link-3`).

**Render:** `node tools/render.mjs huf-procedures-detail-approval --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/procedures/AP-0009` with fixtures [base, agents, procedures].
