# POS checklist gate  `pos-checklist-gate`

Non-dismissible Checklist gate (ChecklistGateDialog): PASS / FAIL radios per item with remarks, required remarks on FAIL, and a Submit Checklist button; blocked and start states.

**When to use:** Blocks the POS until the Opening or Closing checklist is complete; also shown after a POS close with a Skip bar.

**Slots people usually change:** `blocked_msg` (text, e.g. "Cashier has not completed the "), `msg_incomplete` (text, e.g. "Every item must be marked PASS"), `skip_hint` (text, e.g. "The POS close was already subm"), `gate_desc` (text, e.g. "Please complete the checklist "), `fail_required` (text, e.g. "Remarks are required for faile"), `rem2` (text, e.g. "Gas line left on, manager info"). All 22 slots are in `slots.json`.

**States:** default (none), closing-incomplete (props), opening (props), opening-incomplete (props), blocked (props), blocked-opening (props), start (props), submitting (props), submit-error (props), with-skip-bar (props). Details and class/attribute changes in `states.json`.

**Targeting:** root `data-ui="pos-checklist-gate"`; 1 interactive elements with measured boxes in `measurements.json` (e.g. `pos-checklist-submit`).

**Render:** `node tools/render.mjs pos-checklist-gate --locale ar-AE/AED --theme dark` · open `preview.html` (JS-free). Needs ury-v16/ury-fonts.css, ury-v16/ury-ui-tokens.css, ury-v16/ury-ui-base.css, ury-v16/components/pos-shift.css from `tokens/css/` and the desk icon sprite (inlined in preview).
