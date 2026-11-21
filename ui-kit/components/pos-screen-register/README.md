# POS screen: register  `pos-screen-register`

The full POS register at 1440x900: header with Search Menu, 256px category sidebar, All and Special Items pills, a five-column menu grid on gray-50 and the 384px order panel over the footer navigation. One Hummus line is in the cart and its card shows the stepper.

**When to use:** Items, categories and prices bind to data/menus through bindings.json, so render.mjs --menu swaps the menu, language and currency.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `i8_img` (image, e.g. "../../data/images/mediterranea"), `i3_img` (image, e.g. "../../data/images/mediterranea"), `i4_img` (image, e.g. "../../data/images/mediterranea"), `i7_img` (image, e.g. "../../data/images/mediterranea"), `i2_img` (image, e.g. "../../data/images/mediterranea"). All 97 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-register"`; 24 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-screen-register.sidebar.all`).

**Render:** `node tools/render.mjs pos-screen-register --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-register.css from `tokens/css/` and the desk icon sprite (inlined in preview).
