# Portrait kiosk idle warning  `ury-kiosk-screen-portrait-idle`

Unattended-kiosk idle warning: after session_idle_timeout_minutes without pointerdown/keydown (useIdleReset) a "Still there?" dialog covers the menu on a blurred scrim, with a full-width primary "I'm still here" button; without a reply it resets the session after 15 s.

**When to use:** Use on the menu screen when the guest walks away. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels (self-order has no locale file).

**Slots people usually change:** `p10_img` (image, e.g. "../../data/images/cafe/iced-am"), `p14_img` (image, e.g. "../../data/images/cafe/hot-cho"), `img` (image, e.g. "../../data/images/cafe/cappucc"), `p4_img` (image, e.g. "../../data/images/cafe/cappucc"), `p5_img` (image, e.g. "../../data/images/cafe/flat-wh"), `p9_img` (image, e.g. "../../data/images/cafe/iced-la"). All 84 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-portrait-idle"`; 14 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-portrait-idle.new-order`, `ury-kiosk-screen-portrait-idle.card-0`, `ury-kiosk-screen-portrait-idle.card-1`).

**Render:** `node tools/render.mjs ury-kiosk-screen-portrait-idle --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-portrait.css from `tokens/css/` and the desk icon sprite (inlined in preview).
