# Analytics "group by" menu (open)  `huf-analytics-group-menu`

The group-by dropdown of the Analytics tab: Provider, Agent, Model, Conversation, Run kind.

**When to use:** Radix portal captured on its own; place it under the select when composing.

**Slots people usually change:** `option_4` (text, e.g. "Conversation"), `option_1` (text, e.g. "Provider"), `option_5` (text, e.g. "Run kind"), `option_2` (text, e.g. "Agent"), `option_3` (text, e.g. "Model"). All 5 slots are in `slots.json`.

**States:** default (none), hover (class-attr), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-analytics-group-menu"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `huf-analytics-group-menu.div-1`, `huf-analytics-group-menu.div-2`, `huf-analytics-group-menu.div-3`).

**Render:** `node tools/render.mjs huf-analytics-group-menu --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/executions?tab=analytics` with fixtures [base, agents, audit].
