// URY v16 admin Reports specs: data table, filter bar, Reports home, Today's Sales report, Daily P&L (frontend/src/pages/Reports/*, packages/ui data-table/page-header).
import { STATE_NA } from '../lib.mjs';
import { dataTable, SERVICE_COLS, serviceRows, serviceFooter, filterBar, reportsHome, todaysSales, dailyPnl, slotsOf, rtlOf } from './reports.mjs';

const SHELL_CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css'];
const CSS = [...SHELL_CSS, 'ury-v16/components/admin-reports.css'];
const SCREEN_CSS = [...SHELL_CSS, 'ury-v16/components/admin-shell.css', 'ury-v16/components/admin-reports.css'];
const base = { group: 'ury-admin', static: true, dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };
const screenBase = { ...base, css: SCREEN_CSS, width: 1440, height: 900 };
const NA = (what, ...keep) => Object.fromEntries(Object.entries({
  disabled: `not applicable: ${what} has no disabled state in the source`,
  error: `not applicable: ${what} has no error state of its own (the page shows a red banner above it)`,
  loading: `not applicable: ${what} has no loading state`,
  empty: `not applicable: ${what} has no empty state`,
}).filter(([k]) => !keep.includes(k)));
const all = (render, variants) => [render({}, {}), ...Object.values(variants).map((v) => render({}, v.props || {}))].join('');
const note = 'Arabic comes from ury/translations/ar.csv; "Amount", the item, group, branch and breakup names and the sample dates are translated here because ar.csv has no usable entry. "# Orders" and "% of Total" are hard-coded English in the source and stay English. Header cells follow data-table.tsx (12px/500 text-tertiary).';

// ---- data table ----
const dtRows = serviceRows(), dtFoot = serviceFooter();
const dt = (extra) => (v, p) => dataTable({ p: 'dt', cols: SERVICE_COLS, rows: dtRows, footer: dtFoot, ...extra, ...p });
const dtRender = dt({});
const dtVariants = {
  loading: { props: { state: 'loading' }, state: 'loading', describe: 'isLoading: a single "Loading…" row, p-8 text-center text-muted-foreground.' },
  empty: { props: { state: 'empty' }, state: 'empty', describe: 'No rows: the "No results found." message row.' },
  'row-hover': { props: { hover: 1 }, state: 'hover', describe: 'Row hovered: hover:bg-muted/50.' },
  'row-tones': { props: { tones: ['danger', 'warning', 'selected'] }, describe: 'rowTone danger / warning / selected: destructive-tint, warning-tint and primary-tint washes.' },
  'no-footer': { props: { footer: undefined }, describe: 'Plain DataTable without the totals row.' },
};

// ---- filter bar ----
const fbRender = (v, p) => filterBar({ id: 'ury-admin-filter-bar', ...p });
const fbVariants = {
  'multi-empty': { props: { multiEmpty: true }, describe: 'MultiSelect with nothing chosen: gray-400 placeholder instead of chips.' },
  'all-branches': { props: { branchAll: true }, describe: 'Branch select on All Branches.' },
  'date-hover': { props: { hover: 'date' }, state: 'hover', describe: 'Date range trigger hovered: hover:bg-muted/50.' },
  'branch-hover': { props: { hover: 'branch' }, state: 'hover', describe: 'Branch select hovered: border-gray-300.' },
};

// ---- screens ----
const rhRender = (v, p) => reportsHome(p);
const rhVariants = { 'card-hover': { props: { hover: 'month-wise-sales' }, state: 'hover', describe: 'A report card hovered: bg-muted/50, primary border tint and icon.' } };
const trRender = (v, p) => todaysSales(p);
const trVariants = {
  empty: { props: { state: 'empty' }, state: 'empty', describe: 'No sales for the range: the table shows "No results found." and the totals and pagination are hidden.' },
  loading: { props: { state: 'loading' }, state: 'loading', describe: 'isLoading with no data yet: the page shows only the "Loading…" line under the filter bar.' },
  'row-hover': { props: { rowHover: 2 }, state: 'hover', describe: 'Table row hovered: bg-muted/50.' },
  'date-hover': { props: { hover: 'date' }, state: 'hover', describe: 'Date range trigger hovered.' },
};
const plRender = (v, p) => dailyPnl(p);
const plVariants = {
  'profit-day': { props: { profit: true }, describe: 'A profitable day: Gross Profit takes the success tint with a plus sign and the Gross Profit KPI turns success; Net Profit stays negative.' },
  empty: { props: { state: 'empty' }, state: 'empty', describe: 'No submitted Daily P&L for this branch and date: the warning Alert.' },
  loading: { props: { state: 'loading' }, state: 'loading', describe: 'isLoading: the "Loading…" line under the header.' },
};

const mk = (o, render, variants) => ({ ...o, slots: slotsOf(all(render, variants)), rtlValues: rtlOf(all(render, variants)), render, variants });

export const specs = [
  mk({ ...base, id: 'ury-admin-data-table', name: 'URY admin data table', width: 760, props: {}, na: NA('the table', 'loading', 'empty'),
    describe: ['Report DataTable: rounded-lg border, bg-muted/50 header row (12px/500 text-tertiary), 12.5px body rows on hairline dividers, numeric columns end-aligned with tabular numerals, and a bold totals row. Row tone washes mark danger, warning or selected rows.', 'Use for every report and list grid in the admin app; the totals row is added when a report sums its rows. ' + note] }, dtRender, dtVariants),
  mk({ ...base, id: 'ury-admin-filter-bar', name: 'URY admin filter bar', width: 1208, props: {}, na: NA('the filter bar'),
    describe: ['Sticky report filter bar: date range trigger, branch select and an order-type multiselect with removable chips, on a bg-background/95 blurred strip with a bottom border and px 24 py 8.', 'Place directly under the report PageHeader. Built from the UryDateRangePicker trigger, SearchableSelect and MultiSelect class lists. ' + note] }, fbRender, fbVariants),
  mk({ ...screenBase, id: 'ury-admin-screen-reports-home', name: 'URY admin Reports home', props: {}, na: NA('the screen'),
    describe: ['Reports landing screen at 1440x900 inside the admin shell with the Reports group open: the four reportsRegistry groups (Sales Summary 8, Customers & Items 5, Employees & Operations 4, Financial 1) as sections of link cards with the registry icons.', 'Shown when no report is chosen (the live route redirects to Today\'s Sales). ' + note] }, rhRender, rhVariants),
  mk({ ...screenBase, id: 'ury-admin-screen-report', name: 'URY admin Today\'s Sales report', props: {}, na: NA('the screen', 'loading', 'empty'),
    describe: ['Today\'s Sales report at 1440x900 inside the admin shell with the Reports group open: PageHeader with the Updated time, sticky filter bar, six-figure KPI strip, a Top Selling Items table with totals row, and Prev / Next pagination.', 'Template for every report page. The filter bar, totals row and pagination are composed from the date-range, MultiSelect, DataTable and pagination patterns used across the Reports pages. ' + note] }, trRender, trVariants),
  mk({ ...screenBase, id: 'ury-admin-screen-daily-pnl', name: 'URY admin Daily P&L', props: {}, na: NA('the screen', 'loading', 'empty'),
    describe: ['Daily P&L at 1440x900 inside the admin shell with the Reports group open: branch and date selects, four KPI figures and the P&L Statement waterfall with grouped breakup rows, subtotals and highlighted headline rows; the sample day is a loss day, so Gross and Net Profit show the destructive tint with a minus sign above the fold.', 'The statement runs below the fold; the main area scrolls. ' + note] }, plRender, plVariants),
];
