# System `huf-ios`: HUF iPhone app UI

Faithful HTML/CSS recreations of the native SwiftUI Huf app (iPhone 17 Pro, 402x874 pt) for mockups, video and UI animation, used exactly like `huf`
(web) and `huf-desktop`. 1 CSS px = 1 pt; every capture is 3x (1206x2622 for a full screen).

## Contents
- `huf-ios-device-shell` (status bar 9:41, Dynamic Island, home indicator) and 32 components: tab bar, nav header, large title + search, filter chips, chat / pinned / agent / project rows, composer (empty, draft, busy, whitespace, no-files, unavailable), upload row (uploading / failed), user bubble, assistant text, approval card (pending / sending / approved / denied), table artifact, Mermaid diagram card, HTML artifact card, **chart artifact card, chart detail (chart + Data table), diagram detail, HTML page, source view, sheet nav (Done / title / menu), artifact row, unavailable state**, attach and agent-switcher sheets, sign-in and login forms (Password / API key), empty state, voice sheet, computer row, account rows.
- `huf-ios-screen-<state>`: 27 full screens, light and dark, composed only from the components. The 22 simulator-ref states (signin, login, api-key, chats, chat, rich-content, dashboard, projects, agents, you, computers, agent-switcher, attach, voice, upload, uploading, busy, draft, whitespace, no-files, disabled-agent, empty) plus 5 authored from the SwiftUI source (no ref): `chart` (chat with a native chart card), `artifacts` (Artifacts browser sheet), `artifact-detail` (detail sheet: chart + data table, with `html`, `diagram`, `source` variants), `projects-empty` (No projects), `approval` (approval request: pending, with `sending`, `approved`, `denied` variants).
- Content coverage: markdown table (rich-content, dashboard), Mermaid diagram (rich-content, artifact-detail/diagram), HTML dashboard (dashboard, artifact-detail/html), chart (chart, artifact-detail).
- Text is English fictional data (emails only `@example.com`, no network URLs, no Arabic). Edit text only through slots (`slots.json`).

## Pipeline
```bash
node scripts/capture.mjs 'huf-ios-*'       # sources scripts/huf-mobile/ios/{lib,components,screens}.mjs -> components/huf-ios-*/ (light + dark, states/)
node scripts/verify.mjs 'huf-ios-*'        # JS off, zero network, <= 0.5 % vs own screenshot (3x)
node scripts/huf-mobile/compare-ref.mjs    # perceptual diff of every screen vs systems/huf-ios/ref/*.png -> ref-compare.json (+ .compare/*.diff.png)
node scripts/manifest.mjs && node scripts/docs.mjs && node scripts/lint.mjs
```
Static spec shape and the generic loader are documented in `scripts/static-capture.mjs` (capture.mjs auto-loads `specs-huf-ios.mjs` and `specs-huf-android.mjs`).
To change a component edit `scripts/huf-mobile/ios/components.mjs` (or `screens.mjs`, CSS in `tokens/css/huf-ios/huf-ios.css`) and re-run capture.

## Animation-ready contract
- Stable `data-ui` ids on every part (`huf-ios-composer.attach`, `huf-ios-tab-bar.agents`, `huf-ios-confirmation-card.approve`, `huf-ios-sheet-nav.done`, `huf-ios-login-form.field-1`, `huf-ios-sheet-artifacts`, ...), listed with pt boxes in `measurements.json`.
- `slots.json` lists every text (typing / counting animation targets); `states.json` follows the web `huf` convention: `default`, `active` (= finger pressed, on tab bar, nav header, composer attach, approval card, sign-in/login CTA, sheet nav, artifact row), `loading` (composer busy, assistant loading, approval sending, upload row, artifact row, busy screen), `error` (denied, failed upload, unavailable agent), `empty`, `disabled`; extra named states such as `filled` (typed form, enabled CTA), `closed` (sheet dismissed) and the `html` / `diagram` / `source` detail views. `hover` and `focus` are N/A on a touch UI. State previews live in `states/<name>.html|png`; swap a state by loading it, or toggle the same markup (`.is-pressed`, `.on`) on the live node.
- Sheet open/closed: render the screen `closed` state, then the default; the sheet is the `huf-ios-sheet-*` node (slide it from `top: 874px`) over `.hi-scrim`.

## Using it in video
- Pick a screen (`components/huf-ios-screen-chat/preview.html`, `.dark.html`) and render it at 402x874 with deviceScaleFactor 3 (or 2/1 for lighter frames). Tap targets are `data-ui` ids listed in `measurements.json` (pt, relative to the root), e.g. `huf-ios-tab-bar.agents`, `huf-ios-composer.attach`, `huf-ios-nav-header.agent-switch`.
- Animate a flow by swapping screens (chats -> chat -> busy -> chat) or by composing your own screen on `huf-ios-device-shell` with component `component.html` fragments and slot values.
- Dark mode: `<html data-theme="dark">` (tokens from `HufColor.darkHex`).
- Fonts are Inter / Geist Mono stand-ins for SF Pro / SF Mono (not redistributable); glyph shapes differ slightly from the simulator but layout, colour and spacing follow the native source.

## Fidelity
`ref-compare.json` records the perceptual diff per screen (mean 6.2 % -> 2.0 % light, 6.2 % -> 2.0 % dark; every ref screen <= 6 %; the worst before were api-key 16 %, dashboard 16 %, rich-content 14 %, login 10 %, now 0.5 %, 5.9 %, 3.9 %, 0.4 %). The simulator captures carry no home indicator, so screens omit it (only `huf-ios-device-shell` draws one). The 5 authored screens have no simulator ref. The refs of the You and Computers tabs and the composer placeholder are Arabic (the app language leaked into the capture), so those regions are masked/noted.
