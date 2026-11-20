# huf-android-device-shell

Android device shell (Pixel 5 viewport 412x892: status bar 9:41, wifi, battery, gesture pill)

Frame for every screen. Put the screen body in `content` and any scrim/sheet/dialog/drawer in `overlay`. The status bar and gesture pill stay above scrims (as on device).

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-device-shell"]`. Slots: `content`, `overlay`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
