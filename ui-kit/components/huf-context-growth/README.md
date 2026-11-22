# Context growth chart (largest context per turn)  `huf-context-growth`

Bottom of the analytics pane: "Context growth", a line chart of the largest context size per turn (6 turns, 4k to 15k tokens).

**When to use:** Series in data/huf/chat.json (analytics.series).

**Slots people usually change:** `text_steel_soft` (text, e.g. "Largest context size measured "), `text_ink` (text, e.g. "Context growth"), `recharts_label` (text, e.g. "Turn"), `recharts_cartesian_axis_tick_value_10` (text, e.g. "12k"), `recharts_cartesian_axis_tick_value_11` (text, e.g. "16k"), `recharts_cartesian_axis_tick_value_8` (text, e.g. "4k"). All 14 slots are in `slots.json`.

**States:** default (none). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-context-growth"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-context-growth --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/chat/CONV-0001?pane=analytics` with fixtures [base, chat].
