# General settings (personalization)  `huf-settings-general`

General settings: personalization options for the HUF interface (scenery background, opacity, demo-data tools).

**When to use:** undefined

**Slots people usually change:** `text_steel_2` (number, e.g. "55"), `text_muted_foreground_5` (text, e.g. "Creates a Warehouse Type, Item"), `text_muted_foreground_2` (text, e.g. "Toggle a full-page background "), `text_muted_foreground_4` (text, e.g. "Utilities for demoing and test"), `text_muted_foreground` (text, e.g. "Personalize the HUF interface."), `text_muted_foreground_3` (text, e.g. "Shows the custom background on"). All 38 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-settings-general"`; 19 interactive elements with measured boxes in `measurements.json` (e.g. `huf-settings-general.button-1`, `huf-settings-general.link-2`, `huf-settings-general.link-3`).

**Render:** `node tools/render.mjs huf-settings-general --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/settings/general` with fixtures [base, agents, settings].
