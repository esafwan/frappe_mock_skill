# Configure model dialog (custom pricing)  `huf-models-dialog`

Configure dialog for claude-sonnet-4-5: provider, modalities, "Enable custom pricing" on with input, output and cached input cost per 1M tokens.

**When to use:** Establishes how cost is set per model.

**Slots people usually change:** `text_steel_soft_6` (text, e.g. "Optional. Cost for prompt cach"), `text_steel_soft_2` (text, e.g. "Enable custom prices to overri"), `text_steel_soft` (text, e.g. "Select one or more supported m"), `text_steel_soft_3` (text, e.g. "Check this to activate the cus"), `text_steel_soft_4` (text, e.g. "Cost in USD per 1 million prom"), `text_steel_soft_5` (text, e.g. "Cost in USD per 1 million comp"). All 37 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-models-dialog"`; 13 interactive elements with measured boxes in `measurements.json` (e.g. `huf-models-dialog.input-1`, `huf-models-dialog.button-2`, `huf-models-dialog.button-3`).

**Render:** `node tools/render.mjs huf-models-dialog --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/models` with fixtures [base, providers].
