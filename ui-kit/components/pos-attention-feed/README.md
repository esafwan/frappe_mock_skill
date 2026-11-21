# POS Act now and Needs attention feeds  `pos-attention-feed`

InsightFeed (Act now: Sparkles title, severity rail border-s-4 red/amber/blue, dismiss X) stacked over AttentionFeed (Needs Attention: title, count badge, rows with a 3px destructive or warning bar).

**When to use:** Top of the POS Dashboard. The needs-attention severities in Dashboard.tsx are only blocking (destructive) and warning.

**Slots people usually change:** `ins1_body` (text, e.g. "At the current sell rate only "), `ins2_body` (text, e.g. "Average ticket time is 38 min "), `ins1_title` (text, e.g. "Hammour stock will run out bef"), `att1_title` (text, e.g. "2 order(s) pending payment for"), `att3_title` (text, e.g. "1 POS session(s) left open fro"), `att2_title` (text, e.g. "1 table(s) occupied for over 6"). All 14 slots are in `slots.json`.

**States:** default (none), attention-only (props), one-item (props), no-attention (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-attention-feed"`; 0 interactive elements with measured boxes in `measurements.json` (e.g. none).

**Render:** `node tools/render.mjs pos-attention-feed --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-dashboard.css from `tokens/css/` and the desk icon sprite (inlined in preview).
