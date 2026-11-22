# Execution profiles list  `huf-profiles-list`

HUF, Execution profiles: sandbox and approval policies (Auto Approve / Ask Every Time / Never Allow, filesystem policy, wall time and memory limits) that decide what an agent may do without asking.

**When to use:** Built-in and custom profiles from data/huf/decisions.json.

**Slots people usually change:** `text_steel_44` (relative-time, e.g. "1 month ago"), `text_steel_12` (relative-time, e.g. "1 week ago"), `text_steel_20` (relative-time, e.g. "1 week ago"), `text_steel_28` (relative-time, e.g. "3 days ago"), `text_steel_36` (relative-time, e.g. "2 days ago"), `text_steel_9` (number, e.g. "128"). All 82 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (class-attr), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-profiles-list"`; 20 interactive elements with measured boxes in `measurements.json` (e.g. `huf-profiles-list.button-1`, `huf-profiles-list.link-2`, `huf-profiles-list.link-3`).

**Render:** `node tools/render.mjs huf-profiles-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/execution-profiles` with fixtures [base, decisions].
