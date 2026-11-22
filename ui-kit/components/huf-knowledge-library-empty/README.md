# Knowledge library, empty (first-run: "Teach your agents with your own documents.")  `huf-knowledge-library-empty`

First-run Knowledge screen with no sources: headline, Add content / Connect storage actions and three step tiles.

**When to use:** Use as the "before" frame of an onboarding story.

**Slots people usually change:** `text_steel_7` (text, e.g. "Upload files, connect a folder"), `font_semibold` (text, e.g. "Teach your agents with your ow"), `bg_muted_40_3` (text, e.g. "Test and attach to an agent"), `text_micro` (text, e.g. "New knowledge source"), `group_data_collapsible_icon_hidden_23` (text, e.g. "Keyboard shortcuts"), `text_steel_2` (text, e.g. "maya@example.com"). All 69 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-knowledge-library-empty"`; 29 interactive elements with measured boxes in `measurements.json` (e.g. `huf-knowledge-library-empty.link-1`, `huf-knowledge-library-empty.link-2`, `huf-knowledge-library-empty.link-3`).

**Render:** `node tools/render.mjs huf-knowledge-library-empty --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/knowledge?demo=empty` with fixtures [base, agents, knowledge].
