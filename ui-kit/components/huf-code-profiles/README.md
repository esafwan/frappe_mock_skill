# Execution profiles list (approval mode, filesystem policy, resource limits, status)  `huf-code-profiles`

Execution profiles screen: table of the safe-code-execution profiles with approval mode, filesystem policy, wall time / memory limits and Active or Disabled status.

**When to use:** Use for "you decide where agent code may run" beats.

**Slots people usually change:** `text_steel_28` (relative-time, e.g. "2 weeks ago"), `text_steel_36` (relative-time, e.g. "2 weeks ago"), `text_steel_44` (relative-time, e.g. "1 month ago"), `text_steel_20` (relative-time, e.g. "3 days ago"), `text_steel_12` (relative-time, e.g. "1 day ago"), `text_steel_41` (number, e.g. "1024"). All 82 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-code-profiles"`; 20 interactive elements with measured boxes in `measurements.json` (e.g. `huf-code-profiles.button-1`, `huf-code-profiles.link-2`, `huf-code-profiles.link-3`).

**Render:** `node tools/render.mjs huf-code-profiles --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/execution-profiles` with fixtures [base, tools].
