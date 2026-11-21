# Screen: Brief call  `ury-brief-screen-call`

Voice call overlay: back button, time-left pill, level-reactive orb, status, caption and Mute / End controls.

**When to use:** Opened from the Call button. Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.

**Slots people usually change:** `cl_line1` (text, e.g. "How were sales yesterday?"), `cl_fail_d` (text, e.g. "Check your connection."), `cl_hint` (text, e.g. "Voice · up to 10 min"), `cl_fail` (text, e.g. "Couldn’t connect"), `cl_back` (text, e.g. "Back to chat"), `cl_muted` (text, e.g. "You’re muted"). All 21 slots are in `slots.json`.

**States:** default (none), idle (props), speaking (props), muted (props), failed (props), ended (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="ury-brief-screen-call"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs ury-brief-screen-call --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-brief-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/brief.css from `tokens/css/` and the desk icon sprite (inlined in preview).
