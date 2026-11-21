# Screen: Brief Today  `ury-brief-screen-today`

Full 390x844 Today screen: top bar, net sales hero, key-number tiles, feed cards, pinned ask dock.

**When to use:** Whole-screen mockup of the Brief home. Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.

**Slots people usually change:** `h_big` (currency, e.g. "AED 18,420.00"), `f_totalv` (currency, e.g. "AED 18,420.00"), `p1` (currency, e.g. "AED 4,280.00"), `p2` (currency, e.g. "AED 3,150.00"), `p3` (currency, e.g. "AED 2,760.00"), `v_avg` (currency, e.g. "AED 130.00"). All 61 slots are in `slots.json`.

**States:** default (none), menu (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-brief-screen-today"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-brief-screen-today.topbar.avatar`).

**Render:** `node tools/render.mjs ury-brief-screen-today --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-brief-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/brief.css from `tokens/css/` and the desk icon sprite (inlined in preview).
