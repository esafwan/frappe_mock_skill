# Unavailable state: folder icon, No projects, description  `huf-ios-unavailable-state`

System-style content unavailable view (large grey glyph, bold title, secondary description).

**When to use:** Use for empty lists such as Projects.

**Slots people usually change:** `description` (text, e.g. "Projects from your Huf site wi"), `title` (text, e.g. "No projects"). All 2 slots are in `slots.json`.

**States:** default (none), search (props), empty (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-unavailable-state"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-ios-unavailable-state --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
