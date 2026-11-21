# POS order detail panel  `pos-order-detail`

384px order detail panel: sticky header (name, Pencil, red X, status badge), customer / time / waiter / table info, Order Items, Taxes & Charges and the gray-50 footer with Print, Payment and the total.

**When to use:** Right side of the Orders route once a card is selected.

**Slots people usually change:** `total` (currency, e.g. "AED 132.25"), `combined_value` (currency, e.g. "AED 186.25"), `amt1` (currency, e.g. "AED 72.00"), `amt2` (currency, e.g. "AED 18.00"), `amt3` (currency, e.g. "AED 36.00"), `sib1_total` (currency, e.g. "AED 66.00"). All 60 slots are in `slots.json`.

**States:** default (none), paid (props), with-actions (props), discount (props), split (props), merged (props), cancel-dialog (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-order-detail"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `pos-order-detail.edit`, `pos-order-detail.cancel`, `pos-order-detail.print`).

**Render:** `node tools/render.mjs pos-order-detail --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-orders.css from `tokens/css/` and the desk icon sprite (inlined in preview).
