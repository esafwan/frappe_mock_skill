# Invite user dialog, filled (email, name, role)  `huf-members-invite`

Invite user dialog from the Members page: email, full name and a role picker; the chosen role's description appears under the picker.

**When to use:** Radix dialog captured on its own; place over huf-members-people for the full story.

**Slots people usually change:** `role_description` (text, e.g. "Builds agents, flows and knowl"), `title` (text, e.g. "Invite user"), `text_ui_text_2` (text, e.g. "Send invite"), `block_2` (text, e.g. "Full name"), `block` (text, e.g. "Email *"), `justify_between` (text, e.g. "Builder"). All 13 slots are in `slots.json`.

**States:** default (none), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-members-invite"`; 6 interactive elements with measured boxes in `measurements.json` (e.g. `huf-members-invite.input-1`, `huf-members-invite.input-2`, `huf-members-invite.button-3`).

**Render:** `node tools/render.mjs huf-members-invite --set slot=value` · open `preview.html` (JS-free, light only: HUF has no dark theme or RTL). Needs huf/pre-develop/index-BZUhpcW-.css, huf/huf-fonts.css from `tokens/css/`; icons are inline SVG. Captured from HUF `pre-develop` route `/members` with fixtures [base, agents, settings].
