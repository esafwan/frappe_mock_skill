# Members page, People tab (8 people with roles and status)  `huf-members-people`

Members page of the HUF admin app for the fictional supplier Northwind Trading: People / Roles & access switcher, search, status filter, Invite user button and the people table (avatar initials, role pill with menu, Active/Disabled status, row actions).

**When to use:** Establishing shot for any access-control story; people and roles come from data/huf/settings.json.

**Slots people usually change:** `group_data_collapsible_icon_hidden_4` (text, e.g. "AI providers & models"), `person_email_2` (text, e.g. "daniel@example.com"), `person_email_3` (text, e.g. "priya@example.com"), `person_email_4` (text, e.g. "tomas@example.com"), `person_email_7` (text, e.g. "sofia@example.com"), `person_email_8` (text, e.g. "jonas@example.com"). All 100 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-members-people"`; 38 interactive elements with measured boxes in `measurements.json` (e.g. `huf-members-people.button-1`, `huf-members-people.link-2`, `huf-members-people.link-3`).

**Render:** `node tools/render.mjs huf-members-people --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/members` with fixtures [base, agents, settings].
