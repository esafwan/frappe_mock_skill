# POS order panel (v16)  `pos-order-panel-v16`

The 384px order panel of the POS register (OrderPanel.tsx): order-type pills, customer select, pax stepper, cart lines with edit, quantity stepper and delete, Clear cart, the comment button with Total and the full-width Add New Order button.

**When to use:** Pinned to the end edge of the register, 100vh minus 4rem tall; shows the running order while a server taps items. The empty cart is the pos-screen-register-empty screen.

**Slots people usually change:** `total_multi` (currency, e.g. "AED 130.00"), `i1_price` (currency, e.g. "AED 22.00"), `l1_price` (currency, e.g. "AED 22.00"), `l2_price` (currency, e.g. "AED 48.00"), `l3_price` (currency, e.g. "AED 28.00"), `l4_price` (currency, e.g. "AED 32.00"). All 35 slots are in `slots.json`.

**States:** default (none), multi (props), configured (props), dine-in (props), delivery (props), phone-in (props), aggregators (props), update-order (props), disabled (props), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-order-panel-v16"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `pos-order-panel-v16.edit-1`, `pos-order-panel-v16.delete-1`, `pos-order-panel-v16.clear`).

**Render:** `node tools/render.mjs pos-order-panel-v16 --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-register.css from `tokens/css/` and the desk icon sprite (inlined in preview).
