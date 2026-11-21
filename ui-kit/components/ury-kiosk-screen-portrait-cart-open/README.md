# Portrait kiosk cart open  `ury-kiosk-screen-portrait-cart-open`

Cart bar expanded (cartExpanded): the lines block grows above the footer, max-h-[50vh] (960 px) with border-b and p-4; each line is the item name and a 32 px round bordered − / + stepper pair with the quantity between (gap-3).

**When to use:** Use after the guest taps the count/total button. The footer keeps the count/total toggle (aria-expanded) and Checkout. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels (self-order has no locale file).

**Slots people usually change:** `p10_img` (image, e.g. "../../data/images/cafe/iced-am"), `p14_img` (image, e.g. "../../data/images/cafe/hot-cho"), `img` (image, e.g. "../../data/images/cafe/cappucc"), `p4_img` (image, e.g. "../../data/images/cafe/cappucc"), `p5_img` (image, e.g. "../../data/images/cafe/flat-wh"), `p9_img` (image, e.g. "../../data/images/cafe/iced-la"). All 84 slots are in `slots.json`.

**States:** default (none), single-line (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-portrait-cart-open"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-portrait-cart-open.new-order`, `ury-kiosk-screen-portrait-cart-open.card-0`, `ury-kiosk-screen-portrait-cart-open.card-1`).

**Render:** `node tools/render.mjs ury-kiosk-screen-portrait-cart-open --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-portrait.css from `tokens/css/` and the desk icon sprite (inlined in preview).
