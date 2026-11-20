# System `huf`: HUF AI platform UI

Components are captured from the **real HUF React SPA** (github.com/tridz-dev/huf, `frontend/`) running with **no Frappe backend**:
a built dist is served and every API call is answered by Playwright routes on the fake origin `http://huf.mock` (`scripts/huf/app.mjs`).
Output is the same as every other system: `components/huf-*/` with JS-free `preview.html`, `screenshot.png` (+ `.dark`), slots, states, measurements.

## Pipeline
```bash
scripts/huf/build.sh pre-develop              # worktree + vite build --base=/huf/ -> .huf-cache/dist/pre-develop, then CSS -> tokens/css/huf/pre-develop/
scripts/huf/build.sh feat/tables-redesign     # any open PR branch: its own dist and its own CSS folder
node scripts/capture.mjs huf-agent-card       # live (mocked) app -> component (light + dark)
node scripts/verify.mjs huf-agent-card        # JS off, zero network, <= 0.5 % pixels vs its own screenshot
scripts/huf/all.sh [area]                     # all specs of scripts/specs-huf-<area>.mjs, 3 in parallel, then verify
node scripts/docs.mjs && node scripts/lint.mjs
```
Env: `HUF_REPO` (clone, default /home/user/tridz-dev/huf), `HUF_WT` (worktrees), `CHROME_PATH` (if Playwright's bundled Chromium is missing, the
system Chrome is used automatically), `VERIFY_REPORT` (write the verify report to another file).

## How the app runs without a backend
| Concern | Mechanism |
|---|---|
| Static files | `/huf/**` read from `.huf-cache/dist/<branch>`; unknown paths fall back to `index.html` (router basename `/huf`). |
| Auth | `frappe.auth.get_logged_user`, `User/<id>`, `huf.permissions.get_me` (all capabilities) mocked from `data/huf/identity.json`. No login, no cookies, no CSRF. |
| Data | `scripts/huf/fixtures/base.mjs` (port of `frontend/e2e/helpers.ts` catch-alls) + per-area `fixtures/<area>.mjs` reading `data/huf/<area>.json`. Playwright matches the LAST registered route first: register specifics after catch-alls. |
| Websocket | `socket.io` aborted; the resulting "Socket connection failed" toast is hidden (`[data-sonner-toaster]{display:none}`). Streaming probe `huf/stream/ping` mocked. |
| Network | every non-`huf.mock` request is aborted; provider logos (hot-linked from models.dev) get a local monogram SVG. |
| Determinism | clock fixed at 2026-01-01T09:00Z (`page.clock.setFixedTime`), seeded `Math.random`, animations/transitions off. |
| Fonts | HUF declares SF Pro / SF Mono system stacks; `tokens/css/huf/huf-fonts.css` pins Inter + Geist Mono (OFL) in both the live page and the preview. |
| Theme | light = no attribute; dark = `html[data-theme="midnight"]`. No RTL in HUF. |
| CSS | capture maps the stylesheets the live page actually loaded to `tokens/css/huf/<branch>/` (exact build CSS) + `huf-fonts.css`. |

## Writing a spec (`scripts/specs-huf-<area>.mjs`)
```js
export const specs = [{ id: 'huf-agent-card', name: '…', url: '/agents', root: 'main main .flex-1.p-6 > .grid > div:first-child',
  source: 'pre-develop', fixtures: ['agents'], waitFor: 'text=Support Triage',
  prepare: async (page) => { /* click, type, open a dialog … */ },
  slotNames: { 'h3 span': 'agent_name' }, targets: { save: 'button:has-text("Save")' },
  states: { hover: { target: '> div' } }, na: { loading: 'reason' }, describe: ['what it is', 'when to use it'] }];
```
Rules: ids `huf-<area>-<thing>`; one specs file and one fixtures file per area; fictional data only (emails `@example.com`);
Radix portals (dialogs, popovers, selects) live under `body`, so use a `root` on the portal content and `pad` for shadows.
