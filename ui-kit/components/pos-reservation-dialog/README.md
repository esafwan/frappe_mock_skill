# POS reservation dialog  `pos-reservation-dialog`

Table reservation dialogs over a bg-black/50 scrim: Reserve Table (create, max-w-2xl, h-740), Edit (h-840, with a table select), Cancel Reservation, Complete Reservation (customer arrived) and the Table Reserved buffer-time warning.

**When to use:** Opened from the Tables screen (create, warning) and from the card menu of the Reservations route (edit, complete, cancel).

**Slots people usually change:** `warning_description` (text, e.g. "This table has an active reser"), `complete_description` (text, e.g. "Confirm that the customer has "), `error` (text, e.g. "Number of persons cannot excee"), `no_tables_for_slot` (text, e.g. "No tables are available for th"), `notes_placeholder` (text, e.g. "Special requests, occasion, di"), `cancel_description` (text, e.g. "Are you sure you want to cance"). All 53 slots are in `slots.json`.

**States:** default (none), edit (props), cancel (props), complete (props), warning (props), create-empty (props), create-notes (props), create-error (props), create-submitting (props), edit-no-tables (props), edit-loading-tables (props), cancel-loading (props), complete-loading (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-reservation-dialog"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-reservation-dialog --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-reservations.css from `tokens/css/` and the desk icon sprite (inlined in preview).
