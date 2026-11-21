# Portrait kiosk menu  `ury-kiosk-screen-portrait-menu`

Portrait kiosk menu at 1080x1920: sticky header (px-6 py-4, h1 24/600, "New Order" bordered button), a row of w-40 search and a horizontal category nav (rounded-lg border p-2, buttons rounded-md px-3 py-3 14/500, active bg-primary, first "All Items"), a 2-column grid (gap 16) of rounded-xl cards with h-48 images, and the fixed bottom cart bar (border-t, shadow-lg, p-4) with the count/total button and Checkout.

**When to use:** Use as the browse state of the large vertical self-service kiosk. The bar is collapsed (count and total only). The header title is the source h1 (Order for Pickup / Table N). RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels (self-order has no locale file).

**Slots people usually change:** `img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `cart_total` (currency, e.g. "AED 57.00"), `d_rate` (currency, e.g. "AED 16.00"), `v1_rate` (currency, e.g. "AED 16.00"), `v2_rate` (currency, e.g. "AED 20.00"), `r0` (currency, e.g. "AED 12.00"). All 65 slots are in `slots.json`.

**States:** default (none), category-active (props), table-order (props), sold-out (props), empty-cart (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-portrait-menu"`; 15 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-portrait-menu.new-order`, `ury-kiosk-screen-portrait-menu.card-0`, `ury-kiosk-screen-portrait-menu.card-1`).

**Render:** `node tools/render.mjs ury-kiosk-screen-portrait-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-portrait.css from `tokens/css/` and the desk icon sprite (inlined in preview).
