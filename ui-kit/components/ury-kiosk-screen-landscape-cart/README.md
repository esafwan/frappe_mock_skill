# URY landscape kiosk cart  `ury-kiosk-screen-landscape-cart`

Full-screen cart under the repeated kiosk header: CartPage with a bordered "← Back to menu" button, centred "Your Cart" title, bordered line cards with round −/+ steppers, then the item count, total and a full-width "Proceed to checkout" button.

**When to use:** The kiosk passes className="h-full", which drops CartPage's flex-col, so the footer follows the list instead of sitting at the bottom (faithful to the source). Text uses the shared screen's text-sm at kiosk size. Fixed UI labels are author translations for RTL (the self-order app has no locale file) and NEED NATIVE REVIEW; RTL is a kit extension.

**Slots people usually change:** `cart_total` (currency, e.g. "AED 48.00"), `empty_text` (text, e.g. "Your cart is empty."), `checkout` (text, e.g. "Proceed to checkout"), `title` (text, e.g. "Order for Pickup"), `browse` (text, e.g. "Browse the menu"), `back_label` (text, e.g. "← Back to menu"). All 13 slots are in `slots.json`.

**States:** default (none), single-item (props), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-landscape-cart"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-landscape-cart.new-order`, `ury-kiosk-screen-landscape-cart.back`, `ury-kiosk-screen-landscape-cart.checkout`).

**Render:** `node tools/render.mjs ury-kiosk-screen-landscape-cart --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-landscape.css from `tokens/css/` and the desk icon sprite (inlined in preview).
