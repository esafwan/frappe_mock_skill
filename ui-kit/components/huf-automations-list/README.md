# Automations list (cards: status, trigger, agent, last run)  `huf-automations-list`

Automations screen: agent automations as cards with status badge (Active, Paused, Error, Draft), trigger types (Schedule, Doc Event, Webhook, App Event, Manual), agent, last run, Open / Run now actions; search, status filter and New automation button.

**When to use:** Establishing shot for scheduled and event-driven agent stories.

**Slots people usually change:** `min_h_2_5rem_2` (text, e.g. "When an item's stock drops bel"), `min_h_2_5rem` (text, e.g. "Every Monday at 8:00, summaris"), `min_h_2_5rem_6` (text, e.g. "Send a welcome message and the"), `min_h_2_5rem_5` (text, e.g. "Read the supplier price list f"), `min_h_2_5rem_3` (text, e.g. "Answer order-status questions "), `min_h_2_5rem_4` (text, e.g. "Daily reminder to customers wh"). All 139 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-automations-list"`; 44 interactive elements with measured boxes in `measurements.json` (e.g. `huf-automations-list.link-1`, `huf-automations-list.link-2`, `huf-automations-list.link-3`).

**Render:** `node tools/render.mjs huf-automations-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/automations` with fixtures [base, agents, procedures].
