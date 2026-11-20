# Apps launcher, no apps installed  `huf-apps-launcher-empty`

HUF Apps launcher with no apps installed (empty state).

**When to use:** undefined

**Slots people usually change:** `text_pretty` (text, e.g. "Installed apps that depend on "), `text_ink_2` (text, e.g. "No apps available yet"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `text_steel_2` (text, e.g. "maya@example.com"), `text_ink` (text, e.g. "Maya Fernandes"), `sr_only` (text, e.g. "Toggle sidebar"). All 54 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-apps-launcher-empty"`; 24 interactive elements with measured boxes in `measurements.json` (e.g. `huf-apps-launcher-empty.link-1`, `huf-apps-launcher-empty.link-2`, `huf-apps-launcher-empty.link-3`).

**Render:** `node tools/render.mjs huf-apps-launcher-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/apps?demo=empty` with fixtures [base, chat].
