# Add provider dialog: self-hosted local model (Ollama / OpenAI-compatible endpoint)  `huf-providers-add-local`

Add provider dialog with "Is local LLM (self-hosted endpoint)" ticked: API key becomes optional, API Base URL is required (http://ollama.northwind.local:11434) and the brand is Ollama.

**When to use:** Pair with huf-providers-add-cloud for the "own key vs run it yourself" contrast.

**Slots people usually change:** `cursor_pointer` (text, e.g. "Is local LLM (self-hosted endp"), `font_medium_2` (text, e.g. "API Key (optional for local)"), `text_muted_foreground` (text, e.g. "Create a new AI provider"), `font_medium_4` (text, e.g. "Provider Brand"), `font_medium` (text, e.g. "Provider name"), `dialog_title` (text, e.g. "Add provider"). All 22 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-providers-add-local"`; 8 interactive elements with measured boxes in `measurements.json` (e.g. `huf-providers-add-local.input-1`, `huf-providers-add-local.input-2`, `huf-providers-add-local.button-3`).

**Render:** `node tools/render.mjs huf-providers-add-local --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/providers` with fixtures [base, providers].
