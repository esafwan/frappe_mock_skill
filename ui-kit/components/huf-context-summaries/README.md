# Agent settings: Summaries (how long conversations are compressed)  `huf-context-summaries`

Agent editor > Advanced > Developer options > Summaries (shown when "When a conversation gets long" is Summarize): summary ratio, summary model, and the external-template switch (the summary prompt field sits just below the card).

**When to use:** Pairs with huf-context-limits; values in data/huf/chat.json (advanced).

**Slots people usually change:** `text_steel_3` (text, e.g. "Link a reusable summary prompt"), `text_steel` (text, e.g. "Fraction of history to compres"), `text_steel_2` (text, e.g. "Dedicated lightweight model."), `text_muted_foreground` (text, e.g. "Default (main agent model)"), `text_ink_2` (text, e.g. "Use external template"), `font_medium` (text, e.g. "Summary ratio"). All 11 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-context-summaries"`; 4 interactive elements with measured boxes in `measurements.json` (e.g. `huf-context-summaries.ratio-1`, `huf-context-summaries.button-1`, `huf-context-summaries.button-2`).

**Render:** `node tools/render.mjs huf-context-summaries --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/agents/Order%20Status%20Bot#advanced` with fixtures [base, agents, agents-editor, chat].
