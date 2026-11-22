# Configure self-hosted provider with Test Connection results  `huf-providers-test`

Configure dialog for the Ollama endpoint after pressing Test Connection: "Endpoint reachable", two models OK with capability badges (chat, tools) and one model that is missing on the host with a red hint.

**When to use:** Shows the health check a self-hosted setup gets.

**Slots people usually change:** `break_words` (text, e.g. "Model not found on the endpoin"), `text_muted_foreground` (text, e.g. "Update provider configuration "), `cursor_pointer` (text, e.g. "Is local LLM (self-hosted endp"), `font_medium` (text, e.g. "API Key (optional for local)"), `dialog_title` (text, e.g. "Configure Northwind Ollama"), `text_good` (text, e.g. "Endpoint reachable"). All 29 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-providers-test"`; 8 interactive elements with measured boxes in `measurements.json` (e.g. `huf-providers-test.input-1`, `huf-providers-test.button-2`, `huf-providers-test.input-3`).

**Render:** `node tools/render.mjs huf-providers-test --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/providers` with fixtures [base, providers].
