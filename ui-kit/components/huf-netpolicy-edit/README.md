# Network access policy editor (host / CIDR, port range, protocol rules)  `huf-netpolicy-edit`

Network access policy editor for "Internal services only": general settings and three allow rules with host or CIDR, port range and protocol.

**When to use:** Use to show egress allow-listing for agent code.

**Slots people usually change:** `text_steel_4` (text, e.g. "Name this policy so it can be "), `text_steel_6` (text, e.g. "Define the hosts, ports, and p"), `text_steel_5` (text, e.g. "Unique name identifying this n"), `text_steel_3` (text, e.g. "ID Internal services only"), `hover_text_ink` (text, e.g. "Network access policies"), `truncate` (text, e.g. "Internal services only"). All 105 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-netpolicy-edit"`; 45 interactive elements with measured boxes in `measurements.json` (e.g. `huf-netpolicy-edit.link-1`, `huf-netpolicy-edit.link-2`, `huf-netpolicy-edit.link-3`).

**Render:** `node tools/render.mjs huf-netpolicy-edit --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/network-policies/Internal%20services%20only` with fixtures [base, tools].
