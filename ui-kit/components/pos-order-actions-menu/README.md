# POS order actions menu  `pos-order-actions-menu`

192px popover under the three-dot button: Merge Bill and Split Bill items (rounded-lg, border, shadow-lg), plus the cancel-reason dialog as a variant.

**When to use:** Order detail header, when the order can be split or merged.

**Slots people usually change:** `cancel_desc` (text, e.g. "Please enter a reason for canc"), `cancel_placeholder` (text, e.g. "Enter cancel reason"), `btn_confirm_cancel` (text, e.g. "Confirm Cancel"), `order_actions` (text, e.g. "Order actions"), `cancel_title` (text, e.g. "Cancel order"), `merge_bill` (text, e.g. "Merge Bill"). All 8 slots are in `slots.json`.

**States:** default (none), hover (props), merge-only (props), split-only (props), cancel-reason (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-order-actions-menu"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `pos-order-actions-menu.merge`, `pos-order-actions-menu.split`).

**Render:** `node tools/render.mjs pos-order-actions-menu --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shell.css, ury-v16/components/pos-orders.css from `tokens/css/` and the desk icon sprite (inlined in preview).
