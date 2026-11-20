# Skills page (skill cards: status Active / Draft / Error, source Local / Git / Common Destination / App Provided, version, updated)  `huf-skills-list`

Skills screen (EXPERIMENTAL): search, status and source filters, New skill, and six skill cards with status dot, description, source, version and relative update time.

**When to use:** Use to show reusable skills agents can be given.

**Slots people usually change:** `text_steel_15` (relative-time, e.g. "18 hours ago"), `text_steel_50` (relative-time, e.g. "2 weeks ago"), `text_steel_29` (relative-time, e.g. "2 days ago"), `text_steel_36` (relative-time, e.g. "4 days ago"), `text_steel_43` (relative-time, e.g. "1 week ago"), `text_steel_22` (relative-time, e.g. "1 day ago"). All 135 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-skills-list"`; 39 interactive elements with measured boxes in `measurements.json` (e.g. `huf-skills-list.link-1`, `huf-skills-list.link-2`, `huf-skills-list.link-3`).

**Render:** `node tools/render.mjs huf-skills-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/skills` with fixtures [base, agents, learning].
