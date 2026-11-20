# huf-android-segmented-buttons

Segmented buttons (Appearance / Language)

Three-option single choice; selected segment shows a check and the accent tint.

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-segmented-buttons"]`. Slots: `a`, `b`, `c`, `a_on`, `b_on`, `c_on`, `a_chk`, `b_chk`, `c_chk`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
