# URY landscape kiosk product detail  `ury-kiosk-screen-landscape-detail`

Product detail modal over the landscape menu: black/50 scrim, panel h-5/6 w-2/3 rounded-lg shadow-lg with an underlined Back, a full-width object-cover image (natural height, so the panel scrolls), name, description, price, Variants and Add-ons option rows, quantity stepper and a full-width "Add to cart" pill.

**When to use:** Opened by tapping a card when product_detail_enabled is on. The top of the panel is mostly the image; the "options" variant shows it scrolled to the end. Fixed UI labels are author translations for RTL (the self-order app has no locale file) and NEED NATIVE REVIEW; RTL is a kit extension.

**Slots people usually change:** `i11_img` (image, e.g. "../../data/images/cafe/iced-am"), `i15_img` (image, e.g. "../../data/images/cafe/hot-cho"), `i5_img` (image, e.g. "../../data/images/cafe/cappucc"), `i6_img` (image, e.g. "../../data/images/cafe/flat-wh"), `i10_img` (image, e.g. "../../data/images/cafe/iced-la"), `i12_img` (image, e.g. "../../data/images/cafe/iced-mo"). All 106 slots are in `slots.json`.

**States:** default (none), options (props), loading (props), not-found (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-landscape-detail"`; 30 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-landscape-detail.new-order`, `ury-kiosk-screen-landscape-detail.tab-all`, `ury-kiosk-screen-landscape-detail.tab-1`).

**Render:** `node tools/render.mjs ury-kiosk-screen-landscape-detail --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-landscape.css from `tokens/css/` and the desk icon sprite (inlined in preview).
