# POS order card  `pos-order-card`

Order card on the Orders grid (Card p-0): gray-50 header with order name, link tags, table / order type and status badge, then customer, date and total.

**When to use:** One card per order in the 3-column grid; click selects it and fills the detail panel.

**Slots people usually change:** `total` (currency, e.g. "AED 132.25"), `total_merged` (currency, e.g. "AED 186.25"), `note_split` (text, e.g. "Split from INV-0040"), `meta` (text, e.g. "Table T4 • Dine In"), `note_merged` (text, e.g. "Includes INV-0047"), `time` (text, e.g. "Nov 21, 9:42 AM"). All 12 slots are in `slots.json`.

**States:** default (none), draft (props), paid (props), cancelled (props), print-warning (props), split (props), merged (props), selected (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-order-card"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-order-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-orders.css from `tokens/css/` and the desk icon sprite (inlined in preview).
