# Playground, Compare mode after Run both (two models, word diff of the answers)  `huf-playground-compare`

Playground in Compare mode: columns A and B each with provider, model, agent, temperature and max tokens, the same prompt, both responses with word-level diff highlighting and the centre console (copy, swap, diff toggle).

**When to use:** Shows two models answering the same prompt side by side.

**Slots people usually change:** `text_steel_10` (time, e.g. "09:00:00"), `text_steel_13` (time, e.g. "09:00:00"), `text_steel_16` (time, e.g. "08:42:00"), `text_steel_19` (time, e.g. "08:19:00"), `text_steel_22` (time, e.g. "07:24:00"), `focus_visible_ring_0` (text, e.g. "Write a two-sentence WhatsApp "). All 203 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-playground-compare"`; 63 interactive elements with measured boxes in `measurements.json` (e.g. `huf-playground-compare.link-1`, `huf-playground-compare.link-2`, `huf-playground-compare.link-3`).

**Render:** `node tools/render.mjs huf-playground-compare --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground?demo=ledger` with fixtures [base, agents-editor, agents, playground].
