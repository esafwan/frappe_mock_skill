# Mosaic Alerts  `ury-mosaic-alerts`

KOT board system alerts: delayed-order banner, audio-disabled prompt, online/offline toast, Not Permitted login modal.

**When to use:** Shown over the KOT board when an order passes kot_alert_time, when browser audio is blocked, when connectivity changes, or when the session expires. Modes: light and rtl only; dark is not applicable (mosaic/src/index.css defines one light palette (:root only) and no dark: classes or .dark overrides, so the KDS has no dark theme).

**Slots people usually change:** `audio_msg` (text, e.g. "Audio notifications disabled. "), `modal_body` (text, e.g. "Log in to access this page."), `toast_offline` (text, e.g. "You are Offline"), `banner_time` (text, e.g. "Time: 12:40:05"), `toast_online` (text, e.g. "You are online"), `banner_title` (text, e.g. "Order Delayed"). All 10 slots are in `slots.json`.

**States:** default (none), all (props), order-delayed (props), audio-disabled (props), toast-online (props), toast-offline (props), not-permitted (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-mosaic-alerts"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-mosaic-alerts --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-mosaic-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/mosaic.css from `tokens/css/` and the desk icon sprite (inlined in preview).
