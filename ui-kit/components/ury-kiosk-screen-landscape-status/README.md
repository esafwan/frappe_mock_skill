# URY landscape kiosk order status  `ury-kiosk-screen-landscape-status`

Order confirmation under the repeated kiosk header: "Order confirmed", thanks line, a muted pickup-code card (3xl bold code), order / bill status rows (max-w-xs) and a Done button.

**When to use:** Shown after a successful submit; the post-submit screen is a plain column at 20px/14px type with no kitchen-stage data (none exists in the backend). Fixed UI labels are author translations for RTL (the self-order app has no locale file) and NEED NATIVE REVIEW; RTL is a kit extension.

**Slots people usually change:** `thanks` (text, e.g. "Thanks — your order has been s"), `requests_label` (text, e.g. "Open service requests"), `title` (text, e.g. "Order for Pickup"), `confirmed` (text, e.g. "Order confirmed"), `bill_status` (text, e.g. "Not billed yet"), `add_more` (text, e.g. "Add more items"). All 17 slots are in `slots.json`.

**States:** default (none), add-more (props), billed (props), pending (props), open-requests (props), table (props), no-status (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-kiosk-screen-landscape-status"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `ury-kiosk-screen-landscape-status.new-order`, `ury-kiosk-screen-landscape-status.done`).

**Render:** `node tools/render.mjs ury-kiosk-screen-landscape-status --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/kiosk-landscape.css from `tokens/css/` and the desk icon sprite (inlined in preview).
