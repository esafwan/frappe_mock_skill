# POS top navbar (logo, search, user)  `pos-navbar`

POS top bar.

**When to use:** Use at the top of every POS screen.

**Slots people usually change:** `font_medium` (text, e.g. "Administrator"). All 5 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-navbar"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `pos-navbar.logo`, `pos-navbar.search`, `pos-navbar.user`).

**Render:** `node tools/render.mjs pos-navbar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
