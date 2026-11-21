# Mosaic Screen: Production Dashboard  `ury-mosaic-screen-dashboard`

mosaic production dashboard route: header with scopes and a grid of production unit cards.

**When to use:** Home route of the KDS after sign-in. Unit names are sample data; Arabic unit names are translated here, the fixed UI strings come from mosaic/src/locales/ar.json. Modes: light and rtl only; dark is not applicable (mosaic defines one light palette).

**Slots people usually change:** `empty_msg` (text, e.g. "No production units for the se"), `error_msg` (text, e.g. "Unable to load production unit"), `loading_msg` (text, e.g. "Loading Production Dashboard.."), `c_heading` (text, e.g. "Select Active Company"), `b_heading` (text, e.g. "Select Active Branch"), `switch_dashboard` (text, e.g. "Switch to Dashboard"). All 45 slots are in `slots.json`.

**States:** default (none), ready (props), loading (props), empty (props), error (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-screen-dashboard"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `ury-mosaic-scope-selector-trigger`, `ury-mosaic-scope-selector-trigger`, `ury-mosaic-header-refresh`).

**Render:** `node tools/render.mjs ury-mosaic-screen-dashboard --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css, ury-v16/components/mosaic-screens.css from `tokens/css/` and the desk icon sprite (inlined in preview).
