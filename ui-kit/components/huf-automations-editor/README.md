# Automation editor, General tab (name, agent, status)  `huf-automations-editor`

Automation editor, General tab: name, description, agent, project and status controls with Cancel / Save, tabs General, Task, Triggers, Execution, History.

**When to use:** Full 1440x900 page.

**Slots people usually change:** `max_w_60ch` (text, e.g. "An automation runs an Agent au"), `disabled_opacity_50` (text, e.g. "Every Monday at 8:00, summaris"), `text_xl` (text, e.g. "Monday sales digest"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `font_medium_4` (text, e.g. "Project (optional)"), `text_left` (text, e.g. "Weekly Ops Digest"). All 75 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-automations-editor"`; 40 interactive elements with measured boxes in `measurements.json` (e.g. `huf-automations-editor.link-1`, `huf-automations-editor.link-2`, `huf-automations-editor.link-3`).

**Render:** `node tools/render.mjs huf-automations-editor --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/automations/AUT-0001` with fixtures [base, agents, procedures].
