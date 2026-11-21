// POS Dashboard specs: pos-kpi-strip, pos-attention-feed, pos-service-line, pos-dash-panels, pos-screen-dashboard.
// Arabic: fixed UI labels from pos/src/i18n/locales/ar.json (dashboard.*, dash_cards.*, ai.*, notifications.*). The three needs-attention
// messages are server strings (ury_dashboard.py, no ar.json key) and sample names are translated by hand: NEED NATIVE REVIEW.
// Deliberate deviations from the task text, following the source: h1 is 'Shift Overview' (dashboard.title), panels are the page's own
// Panel (card, 20px padding, 28px icon chip, 14/600 title), Tonight vs Baseline has 4 tiles, and FastMovingItems is not rendered by Dashboard.tsx.
import { STATE_NA } from '../lib.mjs';
import { DASH_CSS, SCREEN_CSS, DASH_SLOTS, DASH_RTL, slotsFor, rtlFor, kpiStrip, feeds, serviceLine, dashPanels, dashboardScreen, SHELL_SLOTS, SHELL_RTL } from './dashboard.mjs';
import { HEADER_KEYS, FOOTER_KEYS, pick } from './shell.mjs';

const base = { group: 'pos', static: true, dsf: 2, canvas: 'hsl(var(--background))', css: DASH_CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };
const na = { hover: STATE_NA.desktop, focus: STATE_NA.desktop, active: STATE_NA.desktop };

const kpiRe = /^k\d_/;
const feedRe = /^(att|act|ins)/;
const slRe = /^(sl_|st_|c_|t\d_)/;
const railRe = /^(fl_|w\d_|os_|e\d_|sb_|nt_|n\d_)/;
const screenRe = /./;
const screenSlots = { ...pick(SHELL_SLOTS, [...HEADER_KEYS, ...FOOTER_KEYS]), ...DASH_SLOTS };
const screenRtl = { ...pick(SHELL_RTL, [...HEADER_KEYS, ...FOOTER_KEYS].filter((k) => k in SHELL_RTL)), ...DASH_RTL };

export const specs = [
  { ...base, id: 'pos-kpi-strip', name: 'POS KPI strip', width: 1392, slots: slotsFor(kpiRe), rtlValues: rtlFor(kpiRe), props: { loading: false, hint: false },
    render: (v, p) => kpiStrip({ v, ...p }),
    variants: {
      'with-hint': { props: { hint: true }, describe: 'A stat carrying the optional 11.5px hint line under its value' },
      loading: { props: { loading: true }, describe: 'Stats still loading: 48px skeleton bar (the page shows animate-pulse; the capture is the static frame)' },
    },
    na, describe: ['The four-stat strip at the top of the POS Dashboard: Today\'s Sales, Orders Today, Avg. Order Value and Active Tables, 11px label over a 25px value, hairline dividers, bottom border with 16px padding.', 'Directly under the Needs Attention feed. Currency stats are currency slots; Active Tables is an LTR-isolated fraction.'] },
  { ...base, id: 'pos-attention-feed', name: 'POS Act now and Needs attention feeds', width: 1392, slots: slotsFor(feedRe), rtlValues: rtlFor(feedRe), props: { insights: 2, attention: 3 },
    render: (v, p) => `<div class="pdb pdb-bg" data-ui="pos-attention-feed"><div class="pdb-col">${feeds({ v, ...p })}</div></div>`,
    variants: {
      'attention-only': { props: { insights: 0, attention: 3 }, describe: 'InsightFeed empty state (Nothing needs attention right now.) above the attention rows' },
      'one-item': { props: { insights: 2, attention: 1 }, describe: 'A single needs-attention row (count badge 1)' },
      'no-attention': { props: { insights: 2, attention: 0 }, describe: 'No attention items: the AttentionFeed card is not rendered' },
    },
    na: { ...na, hover: 'rows hover to bg-muted/60 and the dismiss X to gray-700 in the source; not captured' },
    describe: ['InsightFeed (Act now: Sparkles title, severity rail border-s-4 red/amber/blue, dismiss X) stacked over AttentionFeed (Needs Attention: title, count badge, rows with a 3px destructive or warning bar).', 'Top of the POS Dashboard. The needs-attention severities in Dashboard.tsx are only blocking (destructive) and warning.'] },
  { ...base, id: 'pos-service-line', name: 'POS service line panel', width: 1392, slots: slotsFor(slRe), rtlValues: rtlFor(slRe), props: { view: 'ready' },
    render: (v, p) => serviceLine({ v, ...p }),
    variants: {
      'no-over': { props: { view: 'no-over' }, describe: 'No table over time: header meta shows "8 tables tracked" instead of the destructive badge and the warning line is hidden' },
      loading: { props: { view: 'loading' }, describe: 'Panel body while the service line loads' },
      empty: { props: { view: 'empty' }, describe: 'No tables seated yet' },
    },
    na, describe: ['The Service Line panel: Activity chip, title, a destructive "n over time" tag, five stage legend chips with live counts, and one bar per table (minutes above, table name below) with over-time bars in destructive red.', 'Operational heart of the Dashboard. Bar height is minutes against a 90 minute scale; tables with no timer show a 5% stub.'] },
  { ...base, id: 'pos-dash-panels', name: 'POS dashboard right rail', width: 340, slots: slotsFor(railRe), rtlValues: rtlFor(railRe), props: { view: 'ready' },
    render: (v, p) => dashPanels({ v, ...p }),
    variants: { empty: { props: { view: 'empty' }, describe: 'No waiter assignments, no open sessions, no notifications (Shift Brief unchanged)' } },
    na, describe: ['The 340px right column: Floor Load (primary bars per waiter), Open Sessions (gray rows and View all link), Shift Brief (HUF badge) and Recent Notifications (divided list).', 'Right side of the Dashboard main grid; mirrors to the left in RTL.'] },
  { ...base, id: 'pos-screen-dashboard', name: 'POS dashboard screen', width: 1440, height: 900, css: SCREEN_CSS, slots: screenSlots, rtlValues: screenRtl, props: {},
    render: (v, p) => dashboardScreen({ v, ...p }),
    variants: {},
    na, describe: ['Full 1440x900 POS Dashboard route: 48px header without the search pill, page header with the Ask pill and Live badge, Act now and Needs attention feeds, KPI strip, Service Line, then the 1fr / 340px grid (Tonight vs Baseline, Running Low | Floor Load, Open Sessions, Shift Brief, Notifications) above the footer navigation.', 'The Dashboard tab of the POS. The page scrolls inside the content area; this capture is the top of the page.'] },
];
