# POS screen: register with product dialog  `pos-screen-register-product`

The product configurator dialog (pos-product-dialog) opened over the register after a double-click on a menu item: scrim over the sidebar, grid, order panel and header.

**When to use:** Used to show choosing variants, add-ons and a note before adding to the order.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `i8_img` (image, e.g. "../../data/images/mediterranea"), `i3_img` (image, e.g. "../../data/images/mediterranea"), `i4_img` (image, e.g. "../../data/images/mediterranea"), `i7_img` (image, e.g. "../../data/images/mediterranea"), `i2_img` (image, e.g. "../../data/images/mediterranea"). All 123 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-register-product"`; 35 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-screen-register-product.sidebar.all`).

**Render:** `node tools/render.mjs pos-screen-register-product --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-register.css, ury-v16/components/pos-dialogs.css from `tokens/css/` and the desk icon sprite (inlined in preview).
