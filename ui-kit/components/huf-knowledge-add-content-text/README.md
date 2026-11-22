# Add content dialog, Text tab with a title and pasted text  `huf-knowledge-add-content-text`

Add content dialog on the Text tab: optional title and a textarea with typed holiday opening hours.

**When to use:** Use to show teaching an agent a short fact without a file.

**Slots people usually change:** `disabled_opacity_50` (text, e.g. "All stores open 10 am to 4 pm "), `text_muted_foreground` (text, e.g. "Add documents so your agents c"), `tracking_tight_2` (text, e.g. "to "Northwind Support Handbook"), `font_medium` (text, e.g. "Title (optional)"), `flex_1_4` (text, e.g. "Connect storage"), `flex_1` (text, e.g. "Upload files"). All 16 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-add-content-text"`; 12 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-add-content-text.div-1`, `huf-knowledge-add-content-text.button-2`, `huf-knowledge-add-content-text.button-3`).

**Render:** `node tools/render.mjs huf-knowledge-add-content-text --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Support%20Handbook` with fixtures [base, agents, knowledge].
