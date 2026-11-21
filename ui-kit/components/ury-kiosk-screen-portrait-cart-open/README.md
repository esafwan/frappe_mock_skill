# Portrait kiosk cart open  `ury-kiosk-screen-portrait-cart-open`

Cart bar expanded (cartExpanded): the lines block grows above the footer, max-h-[50vh] (960 px) with border-b and p-4; each line is the item name and a 32 px round bordered − / + stepper pair with the quantity between (gap-3).

**When to use:** Use after the guest taps the count/total button. The footer keeps the count/total toggle (aria-expanded) and Checkout. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels (self-order has no locale file).

**Slots people usually change:** `img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `cart_total` (currency, e.g. "AED 57.00"), `d_rate` (currency, e.g. "AED 16.00"), `v1_rate` (currency, e.g. "AED 16.00"), `v2_rate` (currency, e.g. "AED 20.00"), `r0` (currency, e.g. "AED 12.00"). All 65 slots are in `slots.json`.

**States:** default (none), two-lines (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-portrait-cart-open"`; 15 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-portrait-cart-open.new-order`, `ury-kiosk-screen-portrait-cart-open.card-0`, `ury-kiosk-screen-portrait-cart-open.card-1`).

**Render:** `node tools/render.mjs ury-kiosk-screen-portrait-cart-open --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-portrait.css from `tokens/css/` and the desk icon sprite (inlined in preview).
