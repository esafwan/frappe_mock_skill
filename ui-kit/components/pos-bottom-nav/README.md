# POS bottom navigation  `pos-bottom-nav`

POS bottom navigation.

**When to use:** Use as the bottom tab bar.

**Slots people usually change:** `hover_text_primary` (text, e.g. "Dashboard"), `hover_text_primary_4` (text, e.g. "Sessions"), `hover_text_primary_5` (text, e.g. "Settings"), `hover_text_primary_2` (text, e.g. "Tables"), `hover_text_primary_3` (text, e.g. "Orders"), `font_semibold` (text, e.g. "POS"). All 6 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-bottom-nav"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `pos-bottom-nav.link-1`, `pos-bottom-nav.active`, `pos-bottom-nav.link-2`).

**Render:** `node tools/render.mjs pos-bottom-nav --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs fonts.css, ury-pos.css from `tokens/css/` and the desk icon sprite (inlined in preview).
