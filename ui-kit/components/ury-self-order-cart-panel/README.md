# Self-order cart panel  `ury-self-order-cart-panel`

Persistent order-summary + cart aside (w-[32%], border-l, p-4): "Your order so far" block, "Cart" list with round −/+ steppers, tabular-nums total, Place Order, optional Pay Online / Request Bill.

**When to use:** Use on the tablet and landscape kiosk layouts; rendered at 410 wide. Amounts are typed currency slots (the source mixes raw server strings and formatCurrency). RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `o1_amount` (currency, e.g. "AED 12.00"), `o2_amount` (currency, e.g. "AED 36.00"), `order_total` (currency, e.g. "AED 48.00"), `c1_amount` (currency, e.g. "AED 20.00"), `c2_amount` (currency, e.g. "AED 28.00"), `cart_total` (currency, e.g. "AED 48.00"). All 25 slots are in `slots.json`.

**States:** default (none), empty-cart (props), cart-only (props), submitting (props), pay-online (props), paying-online (props), request-bill (props), bill-requested (props), all-actions (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-cart-panel"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-cart-panel.place-order`).

**Render:** `node tools/render.mjs ury-self-order-cart-panel --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css from `tokens/css/` and the desk icon sprite (inlined in preview).
