# Mosaic Scope Selector  `ury-mosaic-scope-selector`

Company/Branch filter dropdown: h28 trigger on --sunk with building icon, w256 popover with heading and check on the selected row.

**When to use:** Header, home route only; option 1 is always "All ..." and the rest come from the user's companies or branches. Modes: light and rtl only; dark is not applicable (mosaic/src/index.css defines one light palette (:root only) and no dark: classes or .dark overrides, so the KDS has no dark theme).

**Slots people usually change:** `c_heading` (text, e.g. "Select Active Company"), `b_heading` (text, e.g. "Select Active Branch"), `switch_dashboard` (text, e.g. "Switch to Dashboard"), `user_email` (text, e.g. "sara@example.com"), `c_1` (text, e.g. "Gulf Hospitality"), `c_sel1` (text, e.g. "Gulf Hospitality"). All 23 slots are in `slots.json`.

**States:** default (none), hover (props), focus (props), closed (props), open (props), open-selected (props), branch (props), disabled (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-scope-selector"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `ury-mosaic-scope-selector-trigger`).

**Render:** `node tools/render.mjs ury-mosaic-scope-selector --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css from `tokens/css/` and the desk icon sprite (inlined in preview).
