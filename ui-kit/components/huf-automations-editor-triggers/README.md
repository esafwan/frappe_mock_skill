# Automation editor, Triggers tab (weekly schedule)  `huf-automations-editor-triggers`

Automation editor, Triggers tab: the weekly schedule trigger with enabled switch, execution mode, interval and repeat count, plus Add trigger.

**When to use:** Shows how an agent is put on a schedule.

**Slots people usually change:** `max_w_60ch` (text, e.g. "An automation runs an Agent au"), `max_w_60ch_2` (text, e.g. "What starts this automation. A"), `text_steel_soft` (text, e.g. "Runs automatically on a repeat"), `text_steel_soft_4` (text, e.g. "Run every N intervals (e.g. ev"), `text_steel_soft_2` (text, e.g. "Turn this trigger off without "), `text_steel_soft_3` (text, e.g. "Runs as soon as the schedule f"). All 80 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-automations-editor-triggers"`; 41 interactive elements with measured boxes in `measurements.json` (e.g. `huf-automations-editor-triggers.link-1`, `huf-automations-editor-triggers.link-2`, `huf-automations-editor-triggers.link-3`).

**Render:** `node tools/render.mjs huf-automations-editor-triggers --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/automations/AUT-0001` with fixtures [base, agents, procedures].
