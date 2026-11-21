# POS toast  `pos-toast`

react-toastify colored toast: 20px status icon, 0.8rem/500 message, close button and a progress bar; the default frame is the KOT alert (showToast.error from KotAlertListener).

**When to use:** Appears top-right for 2 seconds after a KOT error, save or other action.

**Slots people usually change:** `msg_error` (text, e.g. "KOT failed for table 4: Kitche"), `msg_info` (text, e.g. "Order updated by another cashi"), `msg_warning` (text, e.g. "Some items are low in stock."), `msg_success` (text, e.g. "Order sent to the kitchen."). All 4 slots are in `slots.json`.

**States:** default (none), success (props), warning (props), info (props), stacked (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-toast"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-toast --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-misc.css from `tokens/css/` and the desk icon sprite (inlined in preview).
