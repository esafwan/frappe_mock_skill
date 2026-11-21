// T24: ury-desk-sidebar, ury-desk-dock, ury-desk-shell (URY v16 desk navigation).
import { sidebar, dock, deskShell, NAV_SLOTS, NAV_RTL } from './nav.mjs';
const CSS = ['frappe-desk.css', 'theme-vars.css', 'ury-v16/components/desk-nav.css'];
const slotsFor = (render) => { const used = new Set(); render(new Proxy({}, { get: (_, k) => (used.add(String(k).replace(/_initials$/, '')), `{{${String(k)}}}`) }), {}); return Object.fromEntries([...used].filter((k) => k in NAV_SLOTS).map((k) => [k, NAV_SLOTS[k]])); };
const rtlFor = (slots) => Object.fromEntries(Object.keys(slots).map((k) => [k, NAV_RTL[k]]));
const base = { group: 'ury-desk', static: true, dsf: 2, css: CSS, darkTheme: 'dark', modes: ['light', 'dark', 'rtl'], canvas: 'var(--bg-color)',
  naDefault: 'pointer UI: hover/focus are shown as variants where the source styles them',
  na: { disabled: 'not applicable: nav rows have no disabled state', error: 'not applicable: nav has no error state', loading: 'not applicable: nav rows render from the stored Sidebar/Dock doctypes', empty: 'not applicable: the URY sidebar always has Home and its 12 sections' } };

const sbRender = (v, p) => sidebar(v, p);
const sbSlots = slotsFor(sbRender);
const dkRender = (v, p) => dock(v, p);
const dkSlots = slotsFor(dkRender);
const shRender = (v, p) => deskShell(p.active || 'Orders', '', v);
const shSlots = slotsFor(shRender);

export const specs = [
  { ...base, id: 'ury-desk-sidebar', name: 'URY desk sidebar', width: 375, height: 900, slots: sbSlots, rtlValues: rtlFor(sbSlots), props: {}, render: sbRender,
    variants: {
      expanded: { props: {}, describe: 'Expanded 224px panel on the Orders page: the Operate group is open and Orders carries the elevation-3 active pill.' },
      home: { props: { open: null, active: 'Home' }, describe: 'Home workspace: every group is closed (sidebar_focus_section.js closes sections without the active row).' },
      'apps-open': { props: { open: 'Apps', active: 'Home' }, describe: 'The Apps group opened: Open POS, Kitchen Display and URY Console are URL links.' },
      collapsed: { props: { collapsed: true, open: null }, describe: 'Collapsed rail, 48px: marks stay, words fold away, the open group stands in for the active row.' },
      'edge-hover': { props: { wrap: true, edge: 'hover' }, describe: 'Pointer on the 8px edge: the edge draws a 2px rule and the 24px collapse arrow shows on the border.' },
      drawer: { props: { drawer: true }, describe: 'Below md: the panel is a drawer over the page with a rgba(0,0,0,.5) overlay; the edge and arrow are not shown.' },
      'pos-operations': { props: { pops: true, open: 'Apps' }, describe: 'The POS Operations sidebar (module URY POS): the POS Operations link then the Apps group.' },
    },
    describe: ['URY v16 desk sidebar: logo header, Search and Notification, Home, the Apps group and the 12 URY sections (Apps, Plan, Operate, Observe, Control, Finance, Purchasing, Staff & Shifts, AI Insights, Analytics, Reports, Setup) with their pages, and the user chip.',
      'Use as the left panel of any URY desk page; beside a pinned dock the dock takes search, notifications, the user chip and the header mark (see ury-desk-shell).'] },
  { ...base, id: 'ury-desk-dock', name: 'URY desk dock', width: 375, height: 900, slots: dkSlots, rtlValues: rtlFor(dkSlots), props: {}, render: dkRender,
    variants: {
      'analytics-active': { props: { active: 'Analytics' }, describe: 'The Analytics tile active instead of URY.' },
      floating: { props: { mode: 'floating' }, describe: 'Floating dock, revealed from the window edge: fixed, 8px in, radius 18, shadow-2xl, padding 8 11 12; no utilities or avatar.' },
      tooltip: { props: { tooltip: true }, describe: 'Hover on the Analytics tile: its fill and the plain right-hand tooltip with the app name.' },
    },
    describe: ['URY app dock: 57px pinned column with the URY mark in a 49px band, Search and Notification utilities, the two URY dock tiles (URY, Analytics) in 34px r8 tiles with 22px icons, and the 28px user avatar at the foot.',
      'Use beside the sidebar on every URY desk page; the tiles are the apps in ury/dock/ury/ury.json. Icons are the lucide glyphs named in that file (it names no soft module icon).'] },
  { ...base, id: 'ury-desk-shell', name: 'URY desk shell', width: 1440, height: 900, slots: shSlots, rtlValues: rtlFor(shSlots), props: {}, render: shRender,
    variants: {
      home: { props: { active: 'Home' }, describe: 'Home active in the sidebar, no group open.' },
      reports: { props: { active: "Today's Sales" }, describe: 'Reports group open with a report active.' },
    },
    describe: ['1440x900 URY desk composition: pinned dock, 224px sidebar, the top navbar with search, notifications and avatar, and an empty page head.',
      'Starting frame for the URY desk screens; pass the page content to deskShell(active, mainHtml).'] },
];
