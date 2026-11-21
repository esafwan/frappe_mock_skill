# POS header  `pos-header`

The 48px POS top bar: logo, search pill with Command+K hint, printer status button and user button.

**When to use:** Use above every POS page; the placeholder follows the route (register = Search Menu).

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `printer_label` (text, e.g. "Printer Status"), `user_name` (text, e.g. "Sinan Khalid"), `search_placeholder` (text, e.g. "Search Menu"). All 5 slots are in `slots.json`.

**States:** default (props), orders (props), reservations (props), dashboard (props), printer-offline (props), printer-unknown (props), no-printer (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-header"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`).

**Render:** `node tools/render.mjs pos-header --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css from `tokens/css/` and the desk icon sprite (inlined in preview).
