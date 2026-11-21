// URY v16 admin shell specs: header, sidebar, scope menu, page toolbar (frontend/src/components/layout/*).
import { STATE_NA } from '../lib.mjs';
import { adminHeader, adminSidebar, scopeMenu, pageToolbar, shellSlots, shellRtl } from './shell.mjs';

const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/admin-shell.css'];
const base = { group: 'ury-admin', static: true, dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };
const NA = (what) => ({ disabled: `not applicable: ${what} has no disabled state in the source`, error: `not applicable: ${what} has no error state`, loading: `not applicable: ${what} has no loading state (DayStatusCard loading dots are not part of this mock)`, empty: `not applicable: ${what} has no empty state` });
const note = 'Arabic comes from ury/translations/ar.csv; "Plan", "Setup", the sample company, branch and department names and the sample date are translated here because ar.csv has no entry for them.';
// every html variant a spec can render, so slots/rtlValues cover all of them
const all = (render, variants) => [render({}, {}), ...Object.values(variants).map((v) => render({}, v.props || {}))].join('');

const hdrRender = (v, p) => adminHeader(p.route || '/sales-plan', p);
const hdrVariants = {
  'no-unread': { props: { unread: false }, describe: 'Bell without the unread badge (unreadCount is 0).' },
  'all-scope': { values: { company: 'All Companies', branch: 'All Branches' }, describe: 'Company and branch both set to All, the default scope.' },
  'reports-route': { props: { route: '/reports/today-sales' }, describe: 'Breadcrumb on a report route: Reports / Today\'s Sales.' },
  'company-hover': { props: { hover: 'company' }, state: 'hover', describe: 'Company button hovered: bg-muted/70.' },
  'user-hover': { props: { hover: 'user' }, describe: 'User menu button hovered: bg-muted.' },
};
const sbRender = (v, p) => adminSidebar(p.route || '/sales-plan', p);
const sbVariants = {
  collapsed: { props: { collapsed: true }, describe: 'Collapsed rail, 64px wide: icon-only links, no group headers, phase strip only.' },
  'reports-open': { props: { reports: true, route: '/reports/today-sales' }, describe: 'Reports group expanded with its four sub-groups; active report highlighted.' },
  'setup-open': { props: { setup: true, route: '/printer-config' }, describe: 'Setup disclosure expanded; Printer Configuration active.' },
  'link-hover': { props: { hover: '/service' }, state: 'hover', describe: 'Inactive link hovered: bg-hair/60, text-foreground.' },
  'collapsed-reports': { props: { collapsed: true, reports: true, route: '/reports/today-sales' }, describe: 'Collapsed rail with the Reports icons listed.' },
};
const smRender = (v, p) => scopeMenu(p);
const smVariants = {
  'company-selected': { props: { kind: 'company', selected: 0 }, describe: 'Company list with one company selected (primary-tint row, check).' },
  'branch-all': { props: { kind: 'branch', selected: 'all' }, describe: 'Branch dropdown, All Branches selected.' },
  'branch-selected': { props: { kind: 'branch', selected: 1 }, describe: 'Branch dropdown with a single branch selected.' },
  'item-hover': { props: { kind: 'company', selected: 'all', hover: 1 }, state: 'hover', describe: 'Row hovered: bg-muted.' },
};
const ptRender = (v, p) => pageToolbar(p.route || '/sales-plan', p);
const ptVariants = {
  'no-filter-bar': { props: { filters: false }, describe: 'PageToolbar only, without the sticky filter bar.' },
  'pill-hover': { props: { hover: 1 }, state: 'hover', describe: 'Department pill hovered: bg-primary-tint.' },
  'reports-route': { props: { route: '/reports/today-sales' }, describe: 'Breadcrumb for a report page.' },
};

export const specs = [
  { ...base, id: 'ury-admin-header', name: 'URY admin header', width: 1440, slots: shellSlots(all(hdrRender, hdrVariants)), rtlValues: shellRtl(all(hdrRender, hdrVariants)), props: { route: '/sales-plan' }, render: hdrRender, variants: hdrVariants,
    describe: ['Top bar of the URY admin app: logo, divider, breadcrumb, Ask bar, company and branch scope buttons, Open POS, notifications bell and user menu. 48px tall plus a 1px bottom border, px 24, bg-background.', 'Use above every admin screen (adminLayout). ' + note], na: NA('the header') },
  { ...base, id: 'ury-admin-sidebar', name: 'URY admin sidebar', width: 232, height: 900, slots: shellSlots(all(sbRender, sbVariants)), rtlValues: shellRtl(all(sbRender, sbVariants)), props: { route: '/sales-plan' }, render: sbRender, variants: sbVariants,
    describe: ['Navigation rail: DayStatusCard, Plan / Operate / Observe / Control groups, a Reports disclosure and a Setup disclosure pinned to the bottom. 232px expanded, 64px collapsed; the active link is a raised card chip with a primary-coloured icon.', 'Left of every admin screen. Show the collapsed and Reports-open variants for those states. ' + note], na: NA('the sidebar') },
  { ...base, id: 'ury-admin-scope-menu', name: 'URY admin scope menu', width: 256, slots: shellSlots(all(smRender, smVariants)), rtlValues: shellRtl(all(smRender, smVariants)), props: { kind: 'company', selected: 'all' }, render: smRender, variants: smVariants,
    describe: ['Company and branch dropdown opened from the header: 256px card, rounded-lg, shadow-lg, an uppercase title, an All row, a divider and the list; the selected row is primary-tint with a check.', 'Place under the header scope buttons (end-aligned, 8px gap) when a scope menu is open. ' + note], na: NA('the menu') },
  { ...base, id: 'ury-admin-page-toolbar', name: 'URY admin page toolbar', width: 1208, slots: shellSlots(all(ptRender, ptVariants)), rtlValues: shellRtl(all(ptRender, ptVariants)), props: { route: '/sales-plan' }, render: ptRender, variants: ptVariants,
    describe: ['Full-bleed PageToolbar (breadcrumb, 18px/600 title, view toggle, border-b) followed by the sticky filter bar (bg-background/95 with blur, border-b, px 24 py 8) holding the "Jump to" pills and the Add item button.', 'First block inside the admin main area. The toolbar punches through the 24px gutter. ' + note], na: NA('the toolbar') },
];
