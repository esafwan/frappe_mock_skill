# Brief tab bar  `ury-brief-tabbar`

Brief app tab bar: Brief, Ask, Call. 56px plus a 34px home-indicator inset, 24px icons over 11/500 labels, active item shows a 64x32 radius-16 pill filled with the source --accent token (neutral warm gray in light, slate in dark; brief_app tokens.css) and primary-coloured icon and label. Icons reuse the app Icons.tsx glyphs (sparkle, send, phone).

**When to use:** Use at the bottom of the Brief PWA when voice and ask are enabled. Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.

**Slots people usually change:** `t_brief` (text, e.g. "Brief"), `t_call` (text, e.g. "Call"), `t_ask` (text, e.g. "Ask"). All 3 slots are in `slots.json`.

**States:** default (none), ask (props), call (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-brief-tabbar"`; 3 interactive elements with measured boxes in `measurements.json` (e.g. `ury-brief-tabbar.bar.tab-brief`, `ury-brief-tabbar.bar.tab-ask`, `ury-brief-tabbar.bar.tab-call`).

**Render:** `node tools/render.mjs ury-brief-tabbar --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-brief-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/brief.css from `tokens/css/` and the desk icon sprite (inlined in preview).
