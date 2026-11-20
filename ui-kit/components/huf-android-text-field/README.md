# huf-android-text-field

Outlined text field (label/placeholder, supporting text, trailing icon, focus/error)

Material 3 outlined field. state: "" | "focus" | "err" | "floated" | "floated focus".

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-text-field"]`. Slots: `state`, `label`, `value`, `support`, `trailing`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
