# sa-ui-kit plan
Source: bench sa-v16-verify (site sa-v16-verify.local, http://localhost:8001, ury version-16, dev mode on, Administrator/admin). Seeded demo.
Repo: new GitHub repo `ury-ui-kit`, built at /Users/safwan/Code/URY/ury_workspaces/tracks/sa-ui-kit/ui-kit (repo root = ui-kit contents).

Pipeline (Node + Playwright, scripts/ in repo):
1. login.mjs: log in as Administrator, light theme, 1440x900 @2x, save storageState.
2. tokens.mjs: download built desk.bundle.css, ury POS css, Inter fonts, icon sprite (frappe.ui.icons / svg symbols from desk), extract :root vars for light & dark (toggle data-theme), rewrite url() to local relative paths. Also universals.json: currencies, languages (+RTL flag), date/number formats, from API (frappe.boot / Currency, Language lists) as a frozen snapshot.
3. capture.mjs per component: navigate to live page, put UI in state, extract outerHTML of the node, scrub: strip <script>, on* attrs, ids that are dynamic, replace data text with {{slots}} per a slots map, add data-ui; measure interactive element bounding boxes; screenshot element @2x. State capture by forcing hover/focus/disabled/etc. and diffing class/attr.
4. build.mjs: assemble pages/*.html from components only (token substitution), generate manifest.json (stable ids like form.save-button).
5. verify.mjs: render each component.html with JS disabled using sample slot values, pixel-diff vs screenshot.png (pixelmatch), FAIL if >0.5%. Lint: no http(s) URLs, no <script>, no Date/random, all text nodes slotted.
POS components come from the URY POS app (/pos route / ury_pos) - confirm URL on bench first.
Order: tokens -> navbar/sidebar/buttons -> list -> form (fields) -> modal/toast/dropdown/timeline -> report/dashboard -> POS -> pages -> manifest -> verify -> README -> repo push.
Risks: dynamic ids/timestamps -> scrub; awesomplete/dialogs need triggering; POS may need opening shift; text-slotting heuristics (text nodes -> slots).

## Opus review amendments (adopted)
- Each component.html is wrapped at verify/capture time in a harness stub of its real ancestor chain (same classes/attrs, fixed width); real CSS kept (no computed-style inlining) except JS-positioned nodes (popovers, toasts, dropdowns) where inline position styles are copied.
- Dark + RTL captured separately (screenshot.dark.png, screenshot.rtl.png) and verified.
- States via CDP forced pseudo states for screenshots; states.json stores explicit class/attr changes.
- Slots explicit per component (data text + attributes); fixed labels stay literal; sample values = captured text.
- Freeze Date/Math.random during capture; avatar/canvas charts: inline SVG charts only, canvas replaced by static SVG/png.
- Lint fails on absolute "/" paths and http(s); pixelmatch threshold 0.1, fail >0.5%.
- POS needs open shift precondition; capture per page viewport 1440x900.
