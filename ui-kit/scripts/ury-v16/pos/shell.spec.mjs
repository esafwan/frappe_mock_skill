import { SHELL_CSS, SHELL_SLOTS, SHELL_RTL, PLACEHOLDERS, HEADER_KEYS, FOOTER_KEYS, pick, header, footer, userMenu, printerWatch, spotlight } from './shell.mjs';
import { STATE_NA } from '../lib.mjs';
const base = { group: 'pos', static: true, dsf: 2, canvas: 'hsl(var(--background))', css: SHELL_CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };
const ph = (k) => ({ search_placeholder: PLACEHOLDERS[k][0] });
const R = (keys) => pick(SHELL_RTL, keys.filter((k) => k in SHELL_RTL));
const hk = HEADER_KEYS, uk = ['user_name', 'user_email', 'menu_close_shift', 'menu_dashboard', 'menu_desk', 'menu_clear_cache', 'menu_logout'];
const pk = ['pw_title', 'pw_desc', 'pw_sync', 'pw_stale', 'pw_success', 'pw_failed', 'st_excellent', 'st_fair', 'st_critical', 'p1_name', 'p1_ok', 'p1_fail', 'p1_time', 'p2_name', 'p2_ok', 'p2_fail', 'p2_time', 'p3_name', 'p3_ok', 'p3_fail', 'p3_time'];
const sk = ['search_key', 'sp_query', 'sp_placeholder', 'sp_hint', 'sp_empty', ...Object.keys(SHELL_SLOTS).filter((k) => /^sp_(i|sec_|o_|c_)/.test(k))];
const footerV = Object.fromEntries(['dashboard', 'pos', 'tables', 'reservations', 'orders', 'sessions', 'settings'].map((k) => [`active-${k}`, { props: { active: k }, describe: `${k} tab active (chip foreground/background, primary 600 label)` }]));
export const specs = [
  { ...base, id: 'pos-header', name: 'POS header', width: 1440, slots: pick(SHELL_SLOTS, hk), rtlValues: R(hk), props: { variant: 'register', printer: 'online' },
    render: (v, p) => header({ v, ...p }),
    variants: {
      orders: { props: { variant: 'orders' }, values: ph('orders'), describe: 'Orders route: Search Orders placeholder' },
      reservations: { props: { variant: 'reservations' }, values: ph('reservations'), describe: 'Reservations route placeholder' },
      default: { props: { variant: 'default' }, values: ph('default'), describe: 'Any other route: default placeholder' },
      dashboard: { props: { variant: 'dashboard' }, describe: 'Dashboard route hides the search pill' },
      'printer-offline': { props: { printer: 'offline' }, describe: 'Printer status dot: critical' },
      'printer-unknown': { props: { printer: 'unknown' }, describe: 'Printer status dot: no data (gray-400)' },
      'no-printer': { props: { printer: 'none' }, describe: 'Print status disabled in the POS profile: button hidden' },
    },
    describe: ['The 48px POS top bar: logo, search pill with Command+K hint, printer status button and user button.', 'Use above every POS page; the placeholder follows the route (register = Search Menu).'] },
  { ...base, id: 'pos-footer-nav', name: 'POS footer navigation', width: 1440, slots: pick(SHELL_SLOTS, FOOTER_KEYS), rtlValues: R(FOOTER_KEYS), props: { active: 'pos', reservations: true },
    render: (v, p) => footer(p.active, { v, reservations: p.reservations }),
    variants: { ...footerV, 'no-reservations': { props: { active: 'pos', reservations: false }, describe: 'Branch has reservations disabled: 6 items' } },
    describe: ['The bottom rail with seven route tabs; the active tab shows a dark icon chip.', 'Use below every POS page; Reservations appears only when the branch enables it.'] },
  { ...base, id: 'pos-user-menu', name: 'POS user menu', width: 256, slots: pick(SHELL_SLOTS, uk), rtlValues: R(uk),
    render: (v) => userMenu({ v }),
    variants: {},
    describe: ['The open user dropdown: name, email, Close Shift, Switch to Dashboard, Switch To Desk, Clear Cache and Logout.', 'Shown after clicking the user button in the header.'] },
  { ...base, id: 'pos-printer-watch', name: 'POS printer watch dialog', width: 720, slots: pick(SHELL_SLOTS, pk), rtlValues: R(pk), props: { cards: ['online', 'offline'], alert: false },
    render: (v, p) => printerWatch({ v, ...p }),
    variants: {
      online: { props: { cards: ['online'] }, describe: 'Only healthy printers' },
      offline: { props: { cards: ['offline'] }, describe: 'A critical printer: failed count in red' },
      fair: { props: { cards: ['online', 'fair'] }, describe: 'A printer with fair health (warning badge)' },
      alert: { props: { cards: ['online', 'offline'], alert: true }, describe: 'Refresh failed: orange stale-data banner above the cards' },
    },
    describe: ['Printer Health dialog: title, last-synced line, Sync Now button and one card per printer.', 'Opened from the printer status button. PrinterWatch has no ar.json keys: its RTL labels are author translations and NEED NATIVE REVIEW.'] },
  { ...base, id: 'pos-spotlight', name: 'POS spotlight search', width: 720, slots: pick(SHELL_SLOTS, sk), rtlValues: R(sk), props: { items: [1, 2, 3], selected: 0, sections: true },
    render: (v, p) => spotlight({ v, ...p }),
    variants: {
      'second-selected': { props: { selected: 1 }, describe: 'Arrow-down moved the highlight to the second row' },
      query: { props: { items: [1], sections: false }, values: { sp_query: 'Hum' }, describe: 'Typed query narrows the list' },
      empty: { props: { items: [] }, values: { sp_query: 'xyz' }, describe: 'No match: No items found' },
    },
    describe: ['Command palette dialog (Ctrl+K): search input, results grouped under Menu / Orders / Customers headings with 48px thumbnails, and a keyboard hint.', 'The source marks Spotlight as not currently used and draws menu rows only; the section headings and the order and customer rows come from the task spec. The Customers label is an author translation in RTL.'] },
];
