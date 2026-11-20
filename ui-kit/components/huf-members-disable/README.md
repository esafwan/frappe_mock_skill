# Disable user confirmation (alert dialog)  `huf-members-disable`

Confirmation shown before a member is disabled ("This user will lose access to Huf immediately.").

**When to use:** undefined

**Slots people usually change:** `body` (text, e.g. "This user will lose access to "), `title_2` (text, e.g. "Daniel Okafor"), `max_sm_h_11_2` (text, e.g. "Disable user"), `title` (text, e.g. "Disable"), `max_sm_h_11` (text, e.g. "Cancel"). All 6 slots are in `slots.json`.

**States:** default (none), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-members-disable"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `huf-members-disable.button-1`, `huf-members-disable.confirm`).

**Render:** `node tools/render.mjs huf-members-disable --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/members` with fixtures [base, agents, settings].
