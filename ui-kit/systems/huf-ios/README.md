# System `huf-ios`: HUF iPhone app UI

Faithful HTML/CSS recreations of the native SwiftUI Huf app (iPhone 17 Pro, 402x874 pt) for mockups, video and UI animation, used exactly like `huf`
(web) and `huf-desktop`. 1 CSS px = 1 pt; every capture is 3x (1206x2622 for a full screen).

## Contents
- `huf-ios-device-shell` (status bar 9:41, Dynamic Island, home indicator) and 24 components: tab bar, nav header, large title + search, filter chips, chat / pinned / agent / project rows, composer (empty, draft, busy, whitespace, no-files, unavailable), upload row (uploading / failed), user bubble, assistant text, approval card (pending / sending / approved), table artifact, Mermaid diagram card, HTML artifact card, attach and agent-switcher sheets, sign-in and login forms (Password / API key), empty state, voice sheet, computer row, account rows.
- `huf-ios-screen-<state>`: 22 full screens, one per simulator ref state (signin, login, api-key, chats, chat, rich-content, dashboard, projects, agents, you, computers, agent-switcher, attach, voice, upload, uploading, busy, draft, whitespace, no-files, disabled-agent, empty), composed only from the components. Light and dark.
- Text is English fictional data from the app's preview fixtures. Edit text only through slots (`slots.json`).

## Pipeline
```bash
node scripts/capture.mjs 'huf-ios-*'       # sources scripts/huf-mobile/ios/{lib,components,screens}.mjs -> components/huf-ios-*/ (light + dark, states/)
node scripts/verify.mjs 'huf-ios-*'        # JS off, zero network, <= 0.5 % vs own screenshot (3x)
node scripts/huf-mobile/compare-ref.mjs    # perceptual diff of every screen vs systems/huf-ios/ref/*.png -> ref-compare.json (+ .compare/*.diff.png)
node scripts/manifest.mjs && node scripts/docs.mjs && node scripts/lint.mjs
```
Static spec shape and the generic loader are documented in `scripts/static-capture.mjs` (capture.mjs auto-loads `specs-huf-ios.mjs` and `specs-huf-android.mjs`).
To change a component edit `scripts/huf-mobile/ios/components.mjs` (or `screens.mjs`, CSS in `tokens/css/huf-ios/huf-ios.css`) and re-run capture.

## Using it in video
- Pick a screen (`components/huf-ios-screen-chat/preview.html`, `.dark.html`) and render it at 402x874 with deviceScaleFactor 3 (or 2/1 for lighter frames). Tap targets are `data-ui` ids listed in `measurements.json` (pt, relative to the root), e.g. `huf-ios-tab-bar.agents`, `huf-ios-composer.attach`, `huf-ios-nav-header.agent-switch`.
- Animate a flow by swapping screens (chats -> chat -> busy -> chat) or by composing your own screen on `huf-ios-device-shell` with component `component.html` fragments and slot values.
- Dark mode: `<html data-theme="dark">` (tokens from `HufColor.darkHex`).
- Fonts are Inter / Geist Mono stand-ins for SF Pro / SF Mono (not redistributable); glyph shapes differ slightly from the simulator but layout, colour and spacing follow the native source.

## Fidelity
`ref-compare.json` records the perceptual diff per screen. The refs of the You and Computers tabs and the composer placeholder are Arabic (the app language leaked into the capture), so those regions are masked/noted.
