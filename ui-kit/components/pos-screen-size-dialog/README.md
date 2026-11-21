# POS screen size dialog  `pos-screen-size-dialog`

Blocking dialog shown when the window is narrower than 1024px: 64px blue icon circle, Desktop Only title, current/required width and a Switch to Version 1 button (max-w 448, r8, p32).

**When to use:** Shown on phones; points to URY POS v1.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `mobile_note` (text, e.g. "Mobile support will be availab"), `designed_for` (text, e.g. "This POS system is designed fo"), `use_v1` (text, e.g. "You can use URY POS Version 1 "), `current_width` (text, e.g. "Current screen width: 1280px"), `required` (text, e.g. "Required: 1024px or larger"). All 19 slots are in `slots.json`.

**States:** default (none), button-hover (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-size-dialog"`; 10 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-footer-nav.dashboard`).

**Render:** `node tools/render.mjs pos-screen-size-dialog --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-misc.css from `tokens/css/` and the desk icon sprite (inlined in preview).
