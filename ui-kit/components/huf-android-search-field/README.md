# Search field (outlined, leading search icon)  `huf-android-search-field`

Search field (outlined, leading search icon)

**When to use:** Used on Agents and Projects. The drawer variant is the pill `huf-android-search-pill`.

**Slots people usually change:** `placeholder` (text, e.g. "Search agents, providers, or m"). All 1 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-search-field"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-search-field --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
