# POS reservation card  `pos-reservation-card`

Reservation list card (Card + CardContent p-5): TABLE label and table name, status badge, a three-dot action menu, and customer, phone, guest count and reservation time rows.

**When to use:** One card per reservation in the Reservations list view; the grid is 4 columns with a 16px gap at 1440px.

**Slots people usually change:** `c1_notes` (text, e.g. "Window seat, birthday dinner"), `c1_when` (text, e.g. "Sat, Nov 21, 07:30 PM"), `menu_complete` (text, e.g. "Complete Reservation"), `menu_cancel` (text, e.g. "Cancel Reservation"), `menu_edit` (text, e.g. "Edit Reservation"), `c1_phone` (text, e.g. "+971 50 123 4567"). All 16 slots are in `slots.json`.

**States:** default (none), hover (props), active (props), requested (props), completed (props), cancelled (props), no-show (props), menu-open (props), menu-requested (props), kebab-hover (props), with-notes (props), no-phone (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-reservation-card"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `pos-reservation-card.kebab`).

**Render:** `node tools/render.mjs pos-reservation-card --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-reservations.css from `tokens/css/` and the desk icon sprite (inlined in preview).
