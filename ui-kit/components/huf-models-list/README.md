# Models page (model cards with provider, modality badges and pricing)  `huf-models-list`

Models tab: one card per model (gpt-4.1-mini, claude-sonnet-4-5, llama3.1:8b on Northwind Ollama, ...) with provider, modality badges (Text, Image, Embeddings) and custom pricing summary; search and provider filter on top.

**When to use:** Free self-hosted models show "In $0/1M · Out $0/1M".

**Slots people usually change:** `text_steel_13` (text, e.g. "In $0.02/1M · Out $0/1M"), `model_name_3` (text, e.g. "text-embedding-3-small"), `text_steel_17` (text, e.g. "In $3/1M · Out $15/1M"), `text_steel_21` (text, e.g. "In $0/1M · Out $0/1M"), `text_steel_25` (text, e.g. "In $0/1M · Out $0/1M"), `text_steel_29` (text, e.g. "In $0/1M · Out $0/1M"). All 146 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-models-list"`; 47 interactive elements with measured boxes in `measurements.json` (e.g. `huf-models-list.link-1`, `huf-models-list.link-2`, `huf-models-list.link-3`).

**Render:** `node tools/render.mjs huf-models-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/models` with fixtures [base, providers].
