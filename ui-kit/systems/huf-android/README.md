# System `huf-android`: Huf Android app (Material 3)

Hand-authored HTML/CSS recreation of the native Android app (`huf_mobile/android`, Jetpack Compose) for mockups, video and UI animation, the same way `huf` covers web/desktop. Pixel 5 viewport **412 x 892 CSS px (= dp)**, light + dark (`html[data-theme="dark"]`).

## Use
- Pick `components/huf-android-screen-<state>/preview.html` (+ `.dark`) for a full screen, or compose your own: `huf-android-device-shell` takes `content` and `overlay` (scrim, drawer, bottom sheet, dialog) slots.
- Components (`huf-android-*`): device-shell, bottom-nav, top-app-bar, search-field, text-field, signin-form, segmented-buttons, account-rows, agent-card, project-card, empty-state, composer (states: draft, attachment, recording), user-bubble, assistant-text, approval-card (pending, sending, approved, denied), table-artifact, chart-artifact, artifact-row, attachment-chip, chats-drawer, overflow-menu, agent-switcher-sheet, attach-sheet, permission-dialog.
- Each dir has `component.html` (`{{slots}}`), `slots.json`, `states.json` (slot presets, rendered in `states/*.html`), `preview(.dark).html`, `screenshot(.dark).png`, `harness.json`.
- Target elements by `data-ui` (e.g. `huf-android-approval-card.approve`, `huf-android-bottom-nav.agents`).

## Pipeline
```bash
node scripts/huf-mobile/build-android.mjs              # regenerate components + specs-huf-android.mjs from the builders
node scripts/huf-mobile/compare-android.mjs shots      # screenshots (DPR 2)
node scripts/huf-mobile/compare-android.mjs compare    # screens vs emulator refs -> systems/huf-android/ref-compare.json
node scripts/verify.mjs huf-android-screen-signin      # JS-off self-check
```
Edit CSS in `tokens/css/huf-android/`, markup in `scripts/huf-mobile/build-android-lib.mjs` (components) and `build-android.mjs` (screens), then rebuild.

## Fidelity notes
- Font: Roboto is not in the kit; Inter (size-adjusted) is pinned, so glyph shapes differ slightly from the emulator.
- Screens with `ref: null` (signin-filled, composer-draft, composer-attachment, projects-empty) are authored from the Compose source; `voice-listening` has a dark ref only (the light ref is the Android home screen).
- Dark refs exist only for the chat/sign-in/fixture/artifact states; Agents, Account, Projects, Automations, project-detail and remote-computers dark are authored from the tokens.
