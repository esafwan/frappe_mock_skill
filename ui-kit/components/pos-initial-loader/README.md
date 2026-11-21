# POS initial loader  `pos-initial-loader`

Full-screen app loader: 48px primary spinner (static frame), Loading URY POS... and a wait line on white.

**When to use:** Shown while the POS app bootstraps its session and profile.

**Slots people usually change:** `please_wait_setup` (text, e.g. "Please wait while we set thing"), `loading_ury_pos` (text, e.g. "Loading URY POS..."), `loading` (text, e.g. "Loading..."). All 3 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-initial-loader"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-initial-loader --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-misc.css from `tokens/css/` and the desk icon sprite (inlined in preview).
