# Chats drawer (HUF brand, Search threads, New chat, Projects, Automations, Agents, Recent threads)  `huf-android-chats-drawer`

Chats drawer (HUF brand, Search threads, New chat, Projects, Automations, Agents, Recent threads)

**When to use:** Modal navigation drawer, 326 px wide, over a scrim. Put in the shell `overlay` after a `.ha-scrim`.

**Slots people usually change:** `t3` (text, e.g. "Draft reminder for Al Noor Tra"), `t5` (text, e.g. "Onboard Gulf Steel as a vendor"), `t4` (text, e.g. "Data retention policy review"), `t2` (text, e.g. "Overdue receivables summary"), `t1` (text, e.g. "Send the November promo"). All 6 slots are in `slots.json`.

**States:** default (none), closed (props), open (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="huf-android-chats-drawer"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs huf-android-chats-drawer --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs huf-android/fonts.css, huf-android/tokens.css, huf-android/components.css from `tokens/css/` and the desk icon sprite (inlined in preview).
