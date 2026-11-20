# Floating tab bar: Chat, Projects, Agents, You  `huf-ios-tab-bar`

Floating glass capsule tab bar with the selected tab in a grey pill.

**When to use:** Use at the bottom of every top-level screen; pick the active tab with the variant.

**Slots people usually change:** `tab_projects` (text, e.g. "Projects"), `tab_agents` (text, e.g. "Agents"), `tab_chat` (text, e.g. "Chat"), `tab_you` (text, e.g. "You"). All 4 slots are in `slots.json`.

**States:** default (none), active (props), projects (props), agents (props), you (props), pressed (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ios-tab-bar"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ios-tab-bar.chat`, `huf-ios-tab-bar.projects`, `huf-ios-tab-bar.agents`).

**Render:** `node tools/render.mjs huf-ios-tab-bar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-ios/huf-ios-fonts.css, huf-ios/huf-ios-tokens.css, huf-ios/huf-ios.css from `tokens/css/` and the desk icon sprite (inlined in preview).
