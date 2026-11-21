# URY Captain screen: Order, Order tab  `ury-captain-screen-order-list`

Captain order screen with the Order tab: Pax stepper row and the delta-aware list in three groups (Already Ordered gray-500, New / Changed blue-600, Reduction Pending red-600) with the red "Reduce & notify kitchen" link under each confirmed line.

**When to use:** Review and send the order. View-only (no modify permission): amber banner, no toggle, no stepper, no send bar. Empty: "No items yet." with a Browse menu button.

**Slots people usually change:** `l1_price` (currency, e.g. "AED 56.00"), `l2_price` (currency, e.g. "AED 22.00"), `l3_price` (currency, e.g. "AED 48.00"), `l4_price` (currency, e.g. "AED 32.00"), `l5_price` (currency, e.g. "AED 22.00"), `total` (currency, e.g. "AED 78.00"). All 33 slots are in `slots.json`.

**States:** default (none), view-only (props), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-screen-order-list"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-screen-order-list --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css, ury-v16/components/captain-screens.css from `tokens/css/` and the desk icon sprite (inlined in preview).
