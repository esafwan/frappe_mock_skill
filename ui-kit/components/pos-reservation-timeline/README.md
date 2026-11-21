# POS reservation timeline  `pos-reservation-timeline`

Horizontal day timeline (TableReservationTimeline): an hour axis of 24 columns x 120px, half-hour dashed rules, and one 74px block per reservation, coloured by status and stacked into lanes when they overlap.

**When to use:** The Timeline view of the Reservations route; shown scrolled to mid-day (the source scrolls to the current time on today).

**Slots people usually change:** `empty_timeline_hint` (text, e.g. "Reservations will appear along"), `empty_timeline_title` (text, e.g. "No Reservations for this Date"), `loading_timeline` (text, e.g. "Loading timeline view..."), `r1_phone` (text, e.g. "+971 56 456 7890"), `r2_phone` (text, e.g. "+971 50 123 4567"), `r3_phone` (text, e.g. "+971 55 234 5678"). All 51 slots are in `slots.json`.

**States:** default (none), block-hover (props), scrolled-start (props), empty (props), loading (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-reservation-timeline"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-reservation-timeline --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-reservations.css from `tokens/css/` and the desk icon sprite (inlined in preview).
