# POS opening screen  `pos-opening-screen`

Full-screen POS Opening modal (POSOpeningScreen): header, session detail badges, opening balance table with currency inputs and total, and the Open / Retry / Back actions on a bg-black/50 scrim.

**When to use:** First screen a cashier sees when starting a shift, before the register is usable.

**Slots people usually change:** `total_open` (currency, e.g. "AED 500.00"), `total_zero` (currency, e.g. "AED 0.00"), `help` (text, e.g. "Opening Balance is the startin"), `zero_warning` (text, e.g. "You're opening with AED 0.00 a"), `msg_daily_close` (text, e.g. "Yesterday's session was never "), `msg_main_cashier` (text, e.g. "The main cashier hasn't opened"). All 39 slots are in `slots.json`.

**States:** default (none), error-no-profiles (props), error-no-permission (props), warning-previous-day (props), warning-main-cashier (props), zero-balance-confirm (props), retry-actions (props), submitting (props), submit-error (props), profile-select (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-opening-screen"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `pos-opening-submit`).

**Render:** `node tools/render.mjs pos-opening-screen --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shift.css from `tokens/css/` and the desk icon sprite (inlined in preview).
