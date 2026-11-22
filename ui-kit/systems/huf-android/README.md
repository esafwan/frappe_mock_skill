# System `huf-android`: Huf Android app (Material 3)

Hand-authored HTML/CSS recreation of the native Android app (`huf_mobile/android`, Jetpack Compose) for mockups, video and UI animation, the same way `huf` covers web/desktop. Pixel 5 viewport **412 x 892 CSS px (= dp)**, light + dark (`html[data-theme="dark"]`).

## Use
- Pick `components/huf-android-screen-<state>/preview.html` (+ `.dark`) for a full screen, or compose your own: `huf-android-device-shell` takes `content` and `overlay` (scrim, drawer, bottom sheet, dialog) slots.
- Components (`huf-android-*`): device-shell, bottom-nav, top-app-bar, search-field, text-field, signin-form, segmented-buttons, account-rows, agent-card, project-card, empty-state, composer (states: draft, pressed, attachment, busy, stopping, loading, recording), user-bubble, assistant-text, approval-card (pending, sending, approved, denied, pressed), apikey-form, upload-row (uploading, queued, uploaded, failed), mermaid-diagram, html-artifact, table-artifact, chart-artifact, artifact-row, attachment-chip, chats-drawer, overflow-menu, agent-switcher-sheet, attach-sheet, permission-dialog.
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

## Screens (33; 28 components)
Original 25 plus: `signin-apikey`, `signin-apikey-filled`, `chat-busy` (streaming, Stop generation), `chat-uploading`, `chat-upload-failed`, `approval-states` (pending / sending / approved / denied), `chat-rich-diagram` (Mermaid card + HTML dashboard artifact), `chat-html-artifact`. `composer-attachment` now uses the upload row from the Compose source.

## Capture (all steps)
```bash
cd ui-kit
node scripts/capture.mjs 'huf-android-*'          # HTML + screenshots + slots/states (static spec source)
node scripts/huf-mobile/android-meta.mjs          # typed slots, typing flag, pressed/loading/open/closed states, READMEs
node scripts/huf-mobile/compare-android.mjs compare   # -> systems/huf-android/ref-compare.json (side-by-sides in $CMP_OUT)
node scripts/verify.mjs 'huf-android-*'           # JS-off self-check, light + dark
```
Emulator refs: `scripts/huf-mobile/capture-android.sh` (fixtures) and `capture-android-live.sh` (needs `MOCK_URL`, the address the emulator uses to reach `mock_server_android.py`, e.g. `export MOCK_URL=...`). Fixture data uses only example.com addresses and English text. The PNGs in `ref/` are raw emulator captures and may show the mock server address and fixture owner.

## Use in video / animation
- Compose a scene from a screen, or stack components inside `huf-android-device-shell` (`content` + `overlay` slots).
- Typing: set the composer slot `input_cls` to `txt` and grow `draft` character by character; swap the `action` slot from mic to send once text exists (state `draft`), then to stop (state `busy`).
- Pressed: use each component's `pressed` state for a ripple beat (send, approve, agent / project / artifact rows, nav tab, Sign in).
- Sheets, drawer, overflow menu: `closed` -> default pose (translateY / translateX / scale); the scrim is `.ha-scrim`.
- Progress: `upload-row` bar width (`half-done`), `.ha-spin` spinners in approval-card sending and composer `loading`.
- Target by `data-ui`; every component root and its interactive parts have stable ids.
