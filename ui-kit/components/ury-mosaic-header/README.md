# Mosaic Header  `ury-mosaic-header`

mosaic KDS top bar: mosaic.jpg logo at h32, Company/Branch scope selectors on the home route, refresh, user dropdown.

**When to use:** Top of every mosaic route; the home route shows the scope selectors, the KOT board route does not. Arabic strings from mosaic/src/locales/ar.json. Modes: light and rtl only; dark is not applicable (mosaic/src/index.css defines one light palette (:root only) and no dark: classes or .dark overrides, so the KDS has no dark theme).

**Slots people usually change:** `c_heading` (text, e.g. "Select Active Company"), `b_heading` (text, e.g. "Select Active Branch"), `switch_dashboard` (text, e.g. "Switch to Dashboard"), `user_email` (text, e.g. "sara@example.com"), `c_1` (text, e.g. "Gulf Hospitality"), `c_sel1` (text, e.g. "Gulf Hospitality"). All 23 slots are in `slots.json`.

**States:** default (none), hover (props), home (props), board (props), user-menu-open (props), refresh-hover (props), user-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-header"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `ury-mosaic-scope-selector-trigger`, `ury-mosaic-scope-selector-trigger`, `ury-mosaic-header-refresh`).

**Render:** `node tools/render.mjs ury-mosaic-header --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css from `tokens/css/` and the desk icon sprite (inlined in preview).
