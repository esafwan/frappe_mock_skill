# Comment timeline  `comment-timeline`

Comment box plus activity timeline.

**When to use:** Use at the bottom of forms for comments and audit trail.

**Slots people usually change:** `timeline_content_3` (text, e.g. "You last edited this"), `show_all_activity` (text, e.g. "Show all activity"), `timeline_content` (text, e.g. "You created this"), `action_btn` (text, e.g. "New Email"), `action_btn_2` (text, e.g. "New Event"), `activity_title` (text, e.g. "Activity"). All 10 slots are in `slots.json`.

**States:** default (none), hover (css-pseudo), focus (css-pseudo), active (css-pseudo), disabled (class-attr). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="comment-timeline"`; 2 interactive elements with measured boxes in `measurements.json` (e.g. `comment-timeline.button-2`, `comment-timeline.button-3`).

**Render:** `node tools/render.mjs comment-timeline --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs frappe-desk.css, erpnext-erpnext.css from `tokens/css/` and the desk icon sprite (inlined in preview).
