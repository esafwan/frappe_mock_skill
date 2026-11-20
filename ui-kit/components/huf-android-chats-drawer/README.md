# huf-android-chats-drawer

Chats drawer (HUF brand, Search threads, New chat, Projects, Automations, Agents, Recent threads)

Modal navigation drawer, 326 px wide, over a scrim. Put in the shell `overlay` after a `.ha-scrim`.

- System: `huf-android` (Pixel 5 viewport 412x892 CSS px = dp). Light + dark (`html[data-theme="dark"]`).
- Root element: `[data-ui="huf-android-chats-drawer"]`. Slots: `t1`, `t2`, `t3`, `t4`, `t5`. See `slots.json`, `states.json`.
- Files: `component.html` (template, `{{slots}}`), `preview.html` / `preview.dark.html` (JS-free), `screenshot*.png`.
- CSS: `tokens/css/huf-android/{fonts,tokens,components}.css`; mirrored from `ai.huf.mobile.theme.HufTheme`.
