# Create API key dialog, filled  `huf-settings-developer-create-key`

Create key dialog: name, access (all or selected agents), permission checkboxes and expiration.

**When to use:** undefined

**Slots people usually change:** `font_normal` (text, e.g. "All permitted agents"), `font_normal_6` (text, e.g. "Write conversations"), `font_normal_5` (text, e.g. "Read conversations"), `font_normal_2` (text, e.g. "Selected agents"), `text_ui_text` (text, e.g. "Never expires"), `font_medium_3` (text, e.g. "Permissions"). All 31 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-settings-developer-create-key"`; 16 interactive elements with measured boxes in `measurements.json` (e.g. `huf-settings-developer-create-key.input-1`, `huf-settings-developer-create-key.div-2`, `huf-settings-developer-create-key.button-3`).

**Render:** `node tools/render.mjs huf-settings-developer-create-key --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/settings/developer` with fixtures [base, agents, settings].
