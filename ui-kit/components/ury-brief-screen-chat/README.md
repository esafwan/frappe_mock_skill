# Screen: Brief chat  `ury-brief-screen-chat`

Chat thread: WhatsApp-pattern bubbles with KPI and bar cards, a voice message, reply player and composer.

**When to use:** Thread opened from the chats sheet or an Ask action. Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.

**Slots people usually change:** `kc_v1` (currency, e.g. "AED 18,420.00"), `p1` (currency, e.g. "AED 4,280.00"), `p2` (currency, e.g. "AED 3,150.00"), `p3` (currency, e.g. "AED 2,760.00"), `bc_note` (text, e.g. "Composed by the assistant from"), `ch_a1` (text, e.g. "Net sales were up 12.4% on the"). All 40 slots are in `slots.json`.

**States:** default (none), recording (props), empty (props), typing (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-brief-screen-chat"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-brief-screen-chat --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-brief-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/brief.css from `tokens/css/` and the desk icon sprite (inlined in preview).
