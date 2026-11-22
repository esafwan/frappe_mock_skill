# Knowledge library (full screen: sidebar, search + status filter, source cards: updating, ready, needs attention, paused)  `huf-knowledge-library`

Knowledge screen: every knowledge source as a card with health pill (Updating, Ready, Needs attention, Paused), document count, last update, "Used by N agents" and an Add content button.

**When to use:** Establishing shot for any knowledge story; zoom into one card or cut to the source page.

**Slots people usually change:** `text_steel_30` (relative-time, e.g. "2 weeks ago"), `text_steel_9` (relative-time, e.g. "2 mins ago"), `text_steel_12` (relative-time, e.g. "2 mins ago"), `text_steel_24` (relative-time, e.g. "2 days ago"), `text_steel_18` (relative-time, e.g. "1 day ago"), `text_xs` (text, e.g. "Adding documents. You can stil"). All 116 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-library"`; 37 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-library.link-1`, `huf-knowledge-library.link-2`, `huf-knowledge-library.link-3`).

**Render:** `node tools/render.mjs huf-knowledge-library --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge` with fixtures [base, agents, knowledge].
