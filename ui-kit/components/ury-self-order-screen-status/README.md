# Self-order mobile order status screen  `ury-self-order-screen-status`

Order confirmation: centred column (py-8), "Order confirmed" (text-xl semibold), thanks line, order/bill status rows (max-w-xs), optional open service requests, "Add more items" and "Done".

**When to use:** Shown after the order is submitted. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

**Slots people usually change:** `thanks` (text, e.g. "Thanks — your order has been s"), `req_h` (text, e.g. "Open service requests"), `title` (text, e.g. "Order confirmed"), `bill_val` (text, e.g. "Not billed yet"), `add_more` (text, e.g. "Add more items"), `order_label` (text, e.g. "Order status"). All 13 slots are in `slots.json`.

**States:** default (none), pickup (props), no-requests (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-self-order-screen-status"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `ury-self-order-screen-status.add-more`, `ury-self-order-screen-status.done`).

**Render:** `node tools/render.mjs ury-self-order-screen-status --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/self-order.css, ury-v16/components/self-order-mobile.css from `tokens/css/` and the desk icon sprite (inlined in preview).
