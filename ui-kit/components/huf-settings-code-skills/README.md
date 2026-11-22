# Settings: Code and skills (flow code switch, skill sources)  `huf-settings-code-skills`

Settings landing page "Code and skills": the "Allow code in flows" switch (on) and the Skill sources list with the built-in huf-skills source and one team source, plus Save.

**When to use:** Only system administrators can change these; others see a read-only version.

**Slots people usually change:** `text_muted_foreground` (text, e.g. "Lets a flow step run a short p"), `text_muted_foreground_3` (text, e.g. "Each source is a repository fo"), `text_muted_foreground_2` (text, e.g. "Where skills can be imported f"), `text_good` (text, e.g. "Your server administrator allo"), `font_medium` (text, e.g. "Allow code in flows"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"). All 86 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-settings-code-skills"`; 37 interactive elements with measured boxes in `measurements.json` (e.g. `huf-settings-code-skills.link-1`, `huf-settings-code-skills.link-2`, `huf-settings-code-skills.link-3`).

**Render:** `node tools/render.mjs huf-settings-code-skills --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/settings` with fixtures [base, agents, settings].
