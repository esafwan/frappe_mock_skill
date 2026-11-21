# URY Captain screen: Order, tablet  `ury-captain-screen-order-lg`

Captain order screen at the lg breakpoint (tablet): Menu and Order panes side by side (gap 16, p12, white panels with r8 border) and the total + Update Order bar below (mx12 mb12, r8). The pill toggle is hidden.

**When to use:** Captain on a tablet held landscape (1280x800). View-only shows only the order panel and no send bar.

**Slots people usually change:** `image_4` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_2` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_3` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `image_1` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `price_1` (currency, e.g. "AED 22.00"), `price_2` (currency, e.g. "AED 24.00"). All 60 slots are in `slots.json`.

**States:** default (none), view-only (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-captain-screen-order-lg"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-captain-screen-order-lg --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/captain.css, ury-v16/components/captain-screens.css from `tokens/css/` and the desk icon sprite (inlined in preview).
