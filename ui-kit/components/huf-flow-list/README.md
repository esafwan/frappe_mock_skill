# Flows list page (sidebar, header with EXPERIMENTAL chip and count, filters, flow cards)  `huf-flow-list`

Complete Flows screen: two-level sidebar, "Flows" title with EXPERIMENTAL chip and flow count, search + status/category/sort filters and a grid of flow cards (trigger icon, title, Draft/Live/Has problems pill, description, step icons, trigger line, last run, category, Open / Run test / more).

**When to use:** Use as the establishing shot of any flows story; zoom into the first card before cutting to the canvas.

**Slots people usually change:** `text_steel_12` (relative-time, e.g. "Last run: Waiting for approval"), `text_steel_8` (relative-time, e.g. "Last run: Finished 19 mins ago"), `text_steel_16` (relative-time, e.g. "Last run: Finished 2 hours ago"), `text_destructive` (relative-time, e.g. "Last run: Failed 14 hours ago"), `text_steel_3` (text, e.g. "Answers customer messages on W"), `text_steel_9` (text, e.g. "Reads new return requests, che"). All 173 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-list"`; 43 interactive elements with measured boxes in `measurements.json` (e.g. `huf-flow-list.link-1`, `huf-flow-list.link-2`, `huf-flow-list.link-3`).

**Render:** `node tools/render.mjs huf-flow-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows` with fixtures [base, flows, agents].
