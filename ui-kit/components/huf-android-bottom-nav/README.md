# huf-android-bottom-nav

Bottom navigation (Chat / Projects / Agents / Account / Automations)

Five tabs. Mark the active tab by passing "on" to the matching *_on slot.

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-bottom-nav"]`. Slots: `chat_on`, `projects_on`, `agents_on`, `account_on`, `automations_on`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
