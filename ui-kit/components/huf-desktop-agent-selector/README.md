# Composer agent selector (open): Huf agents and models on this computer  `huf-desktop-agent-selector`

The agent and model picker of the composer: the three Huf agents of Northwind Trading (Operations Analyst selected, Buying Assistant, Catalog Writer) with their models, and the on-device options.

**When to use:** Radix portal captured on its own (the window behind it is huf-desktop-chat).

**Slots people usually change:** `hover_text_ink` (text, e.g. "Providers and agents…"), `font_medium` (text, e.g. "Operations Analyst"), `text_steel_soft_2` (text, e.g. "claude-sonnet-4-5"), `text_steel_soft` (text, e.g. "gemini-3.5-flash"), `text_13px` (text, e.g. "Buying Assistant"), `text_steel_soft_3` (text, e.g. "claude-haiku-4-5"). All 19 slots are in `slots.json`.

**States:** default (none), hover (class-attr), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-desktop-agent-selector"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `huf-desktop-agent-selector.div-1`, `huf-desktop-agent-selector.div-2`, `huf-desktop-agent-selector.search`).

**Render:** `node tools/render.mjs huf-desktop-agent-selector --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf-desktop/build/renderer-Bjnbx5Ld.css, huf-desktop/build/AgentFeedContext-E_Qyl_Xs.css, huf-desktop/build/index-Trj-sIE9.css, huf-desktop/huf-desktop-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `huf-desktop` route `#/chat/NW-CONV-0001` with fixtures [base].
