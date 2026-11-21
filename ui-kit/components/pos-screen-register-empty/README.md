# POS screen: register, empty cart  `pos-screen-register-empty`

The POS register with nothing in the order: no item steppers on the grid and the panel shows the Frown empty state with the double-click hint.

**When to use:** The first moment of a new order, before the first tap on a menu item.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `i8_img` (image, e.g. "../../data/images/mediterranea"), `i3_img` (image, e.g. "../../data/images/mediterranea"), `i4_img` (image, e.g. "../../data/images/mediterranea"), `i7_img` (image, e.g. "../../data/images/mediterranea"), `i2_img` (image, e.g. "../../data/images/mediterranea"). All 97 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-register-empty"`; 19 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-screen-register-empty.sidebar.all`).

**Render:** `node tools/render.mjs pos-screen-register-empty --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-register.css from `tokens/css/` and the desk icon sprite (inlined in preview).
