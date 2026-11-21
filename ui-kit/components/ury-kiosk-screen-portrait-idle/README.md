# Portrait kiosk idle warning  `ury-kiosk-screen-portrait-idle`

Unattended-kiosk idle warning: after session_idle_timeout_minutes without pointerdown/keydown (useIdleReset) a "Still there?" dialog covers the menu on a blurred scrim, with a full-width primary "I'm still here" button; without a reply it resets the session after 15 s.

**When to use:** Use on the menu screen when the guest walks away. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels (self-order has no locale file).

**Slots people usually change:** `img` (image, e.g. "data:image/jpeg;base64,/9j/4AA"), `cart_total` (currency, e.g. "AED 57.00"), `d_rate` (currency, e.g. "AED 16.00"), `v1_rate` (currency, e.g. "AED 16.00"), `v2_rate` (currency, e.g. "AED 20.00"), `r0` (currency, e.g. "AED 12.00"). All 65 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-portrait-idle"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-portrait-idle.new-order`, `ury-kiosk-screen-portrait-idle.card-0`, `ury-kiosk-screen-portrait-idle.card-1`).

**Render:** `node tools/render.mjs ury-kiosk-screen-portrait-idle --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-portrait.css from `tokens/css/` and the desk icon sprite (inlined in preview).
