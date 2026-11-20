# Screen: Agents tab, agent list  `huf-ios-screen-agents`

Full iPhone screen: Agents tab, agent list

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/agents.light.png.

**Slots people usually change:** `search_placeholder` (text, e.g. "Search agents"), `chip_1` (text, e.g. "Anthropic"), `tab_projects` (text, e.g. "Projects"), `count` (text, e.g. "4 agents"), `title` (text, e.g. "Agents"), `tab_agents` (text, e.g. "Agents"). All 12 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-agents"`; 9 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-filter-chips.0`, `huf-ios-filter-chips.1`, `huf-ios-filter-chips.2`).

**Render:** `node tools/render.mjs huf-ios-screen-agents --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
