# Outputs card at the end of a conversation (artifacts produced)  `huf-artifacts-outputs`

The Outputs card that closes a conversation turn: count and one row per artifact (report, document) with its type icon; clicking a row opens the artifact pane.

**When to use:** Artifact titles are slots; list in data/huf/chat.json (artifacts).

**Slots people usually change:** `artifact_title_1` (text, e.g. "Q4 sales orders over $5,000"), `artifact_title_2` (text, e.g. "Q4 big orders summary"), `text_ink` (text, e.g. "Outputs"). All 4 slots are in `slots.json`.

**States:** default (none), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-artifacts-outputs"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `huf-artifacts-outputs.first`, `huf-artifacts-outputs.button-1`).

**Render:** `node tools/render.mjs huf-artifacts-outputs --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/CONV-0002` with fixtures [base, chat].
