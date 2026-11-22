# Provider filter chips (All selected)  `huf-ios-filter-chips`

Row of pill chips, the active one tinted with the accent.

**When to use:** Use under the Agents search field.

**Slots people usually change:** `chip_1` (text, e.g. "Anthropic"), `chip_2` (text, e.g. "Google"), `chip_3` (text, e.g. "OpenAI"), `chip_4` (text, e.g. "local"), `chip_all` (text, e.g. "All"). All 5 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-filter-chips"`; 5 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-filter-chips.0`, `huf-ios-filter-chips.1`, `huf-ios-filter-chips.2`).

**Render:** `node tools/render.mjs huf-ios-filter-chips --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
