# huf-android-approval-card

Approval (confirmation) card: Pending / Sending / Approved / Denied

Confirmation card for approval-gated tool calls. Pass state class and the matching footer (`footer` slot).

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-approval-card"]`. Slots: `state`, `title`, `status`, `recipients`, `template`, `channel`, `sample`, `footer`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
