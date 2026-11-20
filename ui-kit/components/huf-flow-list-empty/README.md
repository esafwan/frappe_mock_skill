# Flows list page, no flows yet (first-flow coach)  `huf-flow-list-empty`

Flows screen before anything is built: empty state with the first-flow coach and the New flow action.

**When to use:** Use as the "before" frame of a build-a-flow story.

**Slots people usually change:** `text_pretty` (text, e.g. "No flows have been shared with"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `text_steel_2` (text, e.g. "maya@example.com"), `shadow_none_3` (text, e.g. "Recently updated"), `text_ink` (text, e.g. "Maya Fernandes"), `sr_only` (text, e.g. "Toggle sidebar"). All 65 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-flow-list-empty"`; 28 interactive elements with measured boxes in `measurements.json` (e.g. `huf-flow-list-empty.link-1`, `huf-flow-list-empty.link-2`, `huf-flow-list-empty.link-3`).

**Render:** `node tools/render.mjs huf-flow-list-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/flows` with fixtures [base, agents].
