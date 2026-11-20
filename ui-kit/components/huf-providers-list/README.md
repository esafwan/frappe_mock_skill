# AI providers page (cloud providers and self-hosted Ollama / LM Studio endpoints)  `huf-providers-list`

AI providers screen (Providers | Models tabs): "Get started with AI" starter paths, then provider cards: OpenAI, Anthropic, Google and Mistral as "Configured" cloud API providers, and Northwind Ollama / Warehouse LM Studio marked "Local" (self-hosted endpoint), each with model count and model badges.

**When to use:** Fictional Northwind Trading setup; data in data/huf/providers.json.

**Slots people usually change:** `text_steel_2` (text, e.g. "Pick a free-friendly starter p"), `text_ink_4` (text, e.g. "Try Gemini with Google AI Stud"), `text_steel_33` (text, e.g. "Showing all 6 providers"), `text_10px_3` (text, e.g. "text-embedding-3-small"), `group_data_collapsible_icon_hidden_4` (text, e.g. "AI providers & models"), `min_h_2_5rem_3` (text, e.g. "Self-hosted endpoint"). All 117 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-providers-list"`; 34 interactive elements with measured boxes in `measurements.json` (e.g. `huf-providers-list.button-1`, `huf-providers-list.link-2`, `huf-providers-list.link-3`).

**Render:** `node tools/render.mjs huf-providers-list --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/providers` with fixtures [base, providers].
