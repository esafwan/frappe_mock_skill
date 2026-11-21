# POS reservations screen  `pos-screen-reservations`

The Reservations route in the POS shell: header strip (BookLock chip, title with count pill, room and table selects, date stepper, status select, List / Timeline toggle) over a 4-column grid of reservation cards.

**When to use:** Opened from the Reservations tab of the footer navigation when the branch enables table reservations.

**Slots people usually change:** `logo` (image, e.g. "data:image/png;base64,iVBORw0K"), `empty_hint` (text, e.g. "There are currently no reserva"), `c5_notes` (text, e.g. "Anniversary dinner, please pre"), `empty_timeline_hint` (text, e.g. "Reservations will appear along"), `search_placeholder` (text, e.g. "Search reservations by custome"), `c2_notes` (text, e.g. "Window seat, celebrating a pro"). All 122 slots are in `slots.json`.

**States:** default (none), filter-confirmed (props), menu-open (props), empty (props), loading (props), timeline (props), timeline-empty (props), timeline-loading (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-screen-reservations"`; 14 interactive elements with measured boxes in `measurements.json` (e.g. `pos-header.printer`, `pos-header.user`, `pos-screen-reservations.card-c1.kebab`).

**Render:** `node tools/render.mjs pos-screen-reservations --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-reservations.css from `tokens/css/` and the desk icon sprite (inlined in preview).
