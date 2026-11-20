# Chart artifact (bar chart card with Y-axis values and Chart data list)  `huf-android-chart-artifact`

Chart artifact (bar chart card with Y-axis values and Chart data list)

**When to use:** Native bar chart. Bar heights are px (plot 272 px = 600,000).

**Slots people usually change:** `h2` (num, e.g. "215"), `h1` (num, e.g. "67"), `h3` (num, e.g. "58"), `h4` (num, e.g. "27"), `yaxis` (text, e.g. "Y-axis values: 0·200,000·400,0"), `title` (text, e.g. "Ageing by bucket"). All 6 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-chart-artifact"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-chart-artifact --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
