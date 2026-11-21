# URY landscape kiosk menu  `ury-kiosk-screen-landscape-menu`

Landscape kiosk menu at 1920x1080: header (px-10 py-6, 30px semibold title, "New Order" button), category chips with a w-80 search in a border-b strip, a five-column grid (xl, gap-6) of rounded-2xl cards with h-40 images, and the persistent w-[420px] cart panel at the end.

**When to use:** Use as the main ordering screen of an entrance/counter/food-court kiosk. Body text is 18px (text-lg); the grid scrolls in the app, so the lowest row is clipped. Fixed UI labels are author translations for RTL (the self-order app has no locale file) and NEED NATIVE REVIEW; RTL is a kit extension.

**Slots people usually change:** `img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `o1_amount` (currency, e.g. "AED 10.00"), `o2_amount` (currency, e.g. "AED 14.00"), `order_total` (currency, e.g. "AED 24.00"), `cart_total` (currency, e.g. "AED 48.00"), `i1_rate` (currency, e.g. "AED 10.00"). All 70 slots are in `slots.json`.

**States:** default (none), category-active (props), with-order (props), empty-cart (props), submitting (props), sold-out (props), no-results (props), no-items (props), idle (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-landscape-menu"`; 23 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-landscape-menu.new-order`, `ury-kiosk-screen-landscape-menu.tab-all`, `ury-kiosk-screen-landscape-menu.tab-1`).

**Render:** `node tools/render.mjs ury-kiosk-screen-landscape-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-landscape.css from `tokens/css/` and the desk icon sprite (inlined in preview).
