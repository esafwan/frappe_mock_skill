# SSH connections list (pinned host keys, last test, enabled)  `huf-ssh-connections`

SSH connections screen: remote hosts with user@host:port, auth method, host key Pinned or Unenrolled, last test result and Enabled status.

**When to use:** Use to show agents running commands on managed hosts.

**Slots people usually change:** `text_steel_9` (relative-time, e.g. "10 hours ago"), `text_steel_21` (relative-time, e.g. "3 weeks ago"), `text_steel_18` (relative-time, e.g. "2 days ago"), `text_steel_14` (relative-time, e.g. "1 day ago"), `text_steel_soft_10` (number, e.g. "2222"), `text_steel_soft_5` (number, e.g. "22"). All 79 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-ssh-connections"`; 20 interactive elements with measured boxes in `measurements.json` (e.g. `huf-ssh-connections.button-1`, `huf-ssh-connections.link-2`, `huf-ssh-connections.link-3`).

**Render:** `node tools/render.mjs huf-ssh-connections --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/ssh-connections` with fixtures [base, tools].
