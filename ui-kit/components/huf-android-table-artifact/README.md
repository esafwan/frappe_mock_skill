# Table artifact (markdown table, horizontally clipped)  `huf-android-table-artifact`

Table artifact (markdown table, horizontally clipped)

**When to use:** Rich message table; wide tables clip at the screen edge (horizontal scroll on device).

**Slots people usually change:** `r3` (text, e.g. "Marina Logistics|61,450|31"), `r2` (text, e.g. "Al Noor Trading|88,300|12"), `r1` (text, e.g. "Gulf Steel|412,900|47"), `h2` (text, e.g. "Open (AED)"), `h1` (text, e.g. "Customer"), `h3` (text, e.g. "Days"). All 6 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-table-artifact"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-table-artifact --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
