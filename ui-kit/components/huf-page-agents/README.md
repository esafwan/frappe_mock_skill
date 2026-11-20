# Agents list page (full screen: sidebar + header + filter bar + agent cards)  `huf-page-agents`

Complete Agents screen: two-level sidebar (Hub, Build, Library, Monitor), page title, search + status/chat filters and a grid of agent cards.

**When to use:** Use as the establishing shot for any agent story, or as the base frame before zooming into one card.

**Slots people usually change:** `text_steel_17` (relative-time, e.g. "14 hours ago"), `text_steel_35` (relative-time, e.g. "1 week ago"), `text_steel_44` (relative-time, e.g. "8 mins ago"), `text_steel_53` (relative-time, e.g. "1 hour ago"), `text_steel_62` (relative-time, e.g. "3 days ago"), `text_steel_26` (relative-time, e.g. "1 day ago"). All 161 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-page-agents"`; 38 interactive elements with measured boxes in `measurements.json` (e.g. `huf-page-agents.link-1`, `huf-page-agents.link-2`, `huf-page-agents.link-3`).

**Render:** `node tools/render.mjs huf-page-agents --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BKd4Oh-C.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents` with fixtures [base, agents].
