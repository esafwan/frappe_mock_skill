# Developer settings: agent API docs and API keys  `huf-settings-developer`

Developer page: agent API reference and the API keys table (label, status, scopes, expiry, last used) with Create key.

**When to use:** Keys are fictional (hk_ ids); the secret is never shown after creation.

**Slots people usually change:** `text_muted_foreground_3` (text, e.g. "Full API documentation is comi"), `text_muted_foreground_5` (text, e.g. "Requests are authenticated wit"), `text_muted_foreground_9` (text, e.g. "Run an agent with a message. R"), `text_muted_foreground_2` (text, e.g. "Everything you build against H"), `text_muted_foreground` (text, e.g. "Tools and options for develope"), `text_muted_foreground_4` (text, e.g. "List, inspect, and run agents "). All 114 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-settings-developer"`; 32 interactive elements with measured boxes in `measurements.json` (e.g. `huf-settings-developer.button-1`, `huf-settings-developer.link-2`, `huf-settings-developer.link-3`).

**Render:** `node tools/render.mjs huf-settings-developer --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/settings/developer` with fixtures [base, agents, settings].
