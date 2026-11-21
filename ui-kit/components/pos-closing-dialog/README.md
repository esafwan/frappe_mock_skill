# POS closing dialog  `pos-closing-dialog`

POS Closing dialog (POSClosingDialog + ClosingPaymentTable): summary cards, per-payment-mode opening / expected / closing / difference table, amber warning and Cancel / Close POS footer, with the confirm modal as a variant.

**When to use:** When the cashier ends a shift and counts each payment mode.

**Slots people usually change:** `grand` (currency, e.g. "AED 1,847.50"), `net` (currency, e.g. "AED 1,759.52"), `exp1` (currency, e.g. "AED 1,150.00"), `cl1` (currency, e.g. "AED 1,150.00"), `diff3` (currency, e.g. "AED -177.00"), `open1` (currency, e.g. "AED 500.00"). All 39 slots are in `slots.json`.

**States:** default (none), confirm (props), confirm-submitting (props), submit-error (props), masked-amounts (props), no-invoices (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-closing-dialog"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `pos-closing-submit`).

**Render:** `node tools/render.mjs pos-closing-dialog --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shift.css from `tokens/css/` and the desk icon sprite (inlined in preview).
