# Payment dialog  `pos-payment-dialog`

POS payment dialog.

**When to use:** Use for the checkout/payment scene; currency follows the locale.

**Slots people usually change:** `gap_1` (currency, e.g. "₹ 1,110"), `gap_1_3` (currency, e.g. "₹ 1,110"), `justify_between` (currency, e.g. "₹ 1,110"), `text_lg_2` (currency, e.g. "₹ 1,110"), `font_semibold` (text, e.g. "Payment Methods"), `gap_2` (text, e.g. "Apply Discount"). All 24 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-payment-dialog"`; 7 interactive elements with measured boxes in `measurements.json` (e.g. `pos-payment-dialog.button-1`, `pos-payment-dialog.input-2`, `pos-payment-dialog.button-3`).

**Render:** `node tools/render.mjs pos-payment-dialog --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
