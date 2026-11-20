# Network access policies list (rule counts)  `huf-netpolicy-list`

Network access policies screen: named egress policies with rule counts and last modified, plus New policy.

**When to use:** Use to show which hosts and ports agent code may reach.

**Slots people usually change:** `text_steel_13` (relative-time, e.g. "2 weeks ago"), `text_steel_17` (relative-time, e.g. "1 month ago"), `text_steel_10` (relative-time, e.g. "1 week ago"), `text_steel_6` (relative-time, e.g. "1 day ago"), `text_steel_18` (text, e.g. "Showing all 4 network access p"), `truncate` (text, e.g. "Network access policies"). All 74 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-netpolicy-list"`; 27 interactive elements with measured boxes in `measurements.json` (e.g. `huf-netpolicy-list.link-1`, `huf-netpolicy-list.link-2`, `huf-netpolicy-list.link-3`).

**Render:** `node tools/render.mjs huf-netpolicy-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/network-policies` with fixtures [base, tools].
