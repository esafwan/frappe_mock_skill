# Add provider dialog: own API key (cloud provider)  `huf-providers-add-cloud`

Add provider dialog filled for a cloud provider with the customer's own API key: name, masked API key, optional base URL and brand picker (Groq).

**When to use:** Dialog is a portal captured on its own; the page behind it is huf-providers-list.

**Slots people usually change:** `text_muted_foreground_2` (text, e.g. "Only needed for a custom or se"), `cursor_pointer` (text, e.g. "Is local LLM (self-hosted endp"), `text_muted_foreground_3` (text, e.g. "Suggested from provider name:"), `text_muted_foreground` (text, e.g. "Create a new AI provider"), `font_medium_4` (text, e.g. "Provider Brand"), `font_medium` (text, e.g. "Provider name"). All 24 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-providers-add-cloud"`; 8 interactive elements with measured boxes in `measurements.json` (e.g. `huf-providers-add-cloud.input-1`, `huf-providers-add-cloud.input-2`, `huf-providers-add-cloud.button-3`).

**Render:** `node tools/render.mjs huf-providers-add-cloud --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/providers` with fixtures [base, providers].
