# Playground, Load template dialog  `huf-playground-templates`

Load template dialog opened from Templates > Load template…: search box and a list of active prompt templates with visibility badge, description and tags.

**When to use:** Close-up for the "reuse a saved prompt" beat.

**Slots people usually change:** `text_steel_5` (text, e.g. "Answers return questions stric"), `text_steel_2` (text, e.g. "Summarise a supplier invoice a"), `text_steel_4` (text, e.g. "Turns the week's order and ret"), `text_steel` (text, e.g. "Explains a shipping delay in t"), `text_steel_3` (text, e.g. "Drafts a short, friendly first"), `text_muted_foreground` (text, e.g. "Load an active Agent Prompt te"). All 24 slots are in `slots.json`.

**States:** default (none), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-playground-templates"`; 7 interactive elements with measured boxes in `measurements.json` (e.g. `huf-playground-templates.search`, `huf-playground-templates.button-1`, `huf-playground-templates.button-2`).

**Render:** `node tools/render.mjs huf-playground-templates --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/playground` with fixtures [base, agents-editor, agents, playground].
