# Screen: Projects tab, empty state  `huf-ios-screen-projects-empty`

Full iPhone screen: Projects tab, empty state

**When to use:** Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/projects-empty.light.png.

**Slots people usually change:** `un_desc` (text, e.g. "Projects from your Huf site wi"), `search_placeholder` (text, e.g. "Search projects"), `un_title` (text, e.g. "No projects"), `title` (text, e.g. "Projects"), `tab_projects` (text, e.g. "Projects"), `tab_agents` (text, e.g. "Agents"). All 8 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-screen-projects-empty"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-large-title.add`, `huf-ios-large-title.calendar`, `huf-ios-tab-bar.chat`).

**Render:** `node tools/render.mjs huf-ios-screen-projects-empty --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
