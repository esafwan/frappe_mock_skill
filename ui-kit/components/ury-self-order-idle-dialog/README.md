# Self-order idle dialog  `ury-self-order-idle-dialog`

Idle-timeout dialog ("Still there?") shown by useIdleReset after 90 s without input: centred card on a blurred scrim, title and a full-width primary "I'm still here" button (py-3, text-base, font-medium).

**When to use:** Use on tablet and kiosk screens before the session resets. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `still_here` (text, e.g. "I'm still here"), `title` (text, e.g. "Still there?"), `close` (text, e.g. "Close"). All 3 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-idle-dialog"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-idle-dialog.still-here`).

**Render:** `node tools/render.mjs ury-self-order-idle-dialog --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css from `tokens/css/` and the desk icon sprite (inlined in preview).
