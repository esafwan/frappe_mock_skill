# Add content dialog, Web page tab with a URL filled  `huf-knowledge-add-content-web`

Add content dialog on the Web page tab: one address field filled with a help-centre page URL.

**When to use:** Use to show adding a web page as a source document.

**Slots people usually change:** `text_muted_foreground` (text, e.g. "Add documents so your agents c"), `tracking_tight_2` (text, e.g. "to "Northwind Support Handbook"), `flex_1_4` (text, e.g. "Connect storage"), `flex_1` (text, e.g. "Upload files"), `text_ui_text_2` (text, e.g. "Add web page"), `tracking_tight` (text, e.g. "Add content"). All 13 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-add-content-web"`; 11 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-add-content-web.div-1`, `huf-knowledge-add-content-web.button-2`, `huf-knowledge-add-content-web.button-3`).

**Render:** `node tools/render.mjs huf-knowledge-add-content-web --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge/Northwind%20Support%20Handbook` with fixtures [base, agents, knowledge].
