// POS Tables specs: table card, legend, layout view, actions menu, and the two route screens (1440x900).
// Arabic: fixed UI labels from pos/src/i18n/locales/ar.json. Sample data (table names T1-T14, rooms Main Hall and Terrace, times) has no Arabic source:
// room names and times are translated by hand, table names stay Latin as in the data.
import { STATE_NA } from '../lib.mjs';
import { TABLES, TABLES_CSS, SCREEN_CSS, SLOTS, RTL, specSlots, only, CARD_KEYS, LEGEND_KEYS, MENU_KEYS, LAYOUT_KEYS, SCREEN_TABLES_KEYS, hdrSlots, hdrRtl, tableCard, cardStage, legend, actionsMenu, layoutView, tablesScreen, layoutScreen } from './tables.mjs';

const base = { dsf: 2, canvas: 'hsl(var(--background))', darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], group: 'pos', static: true, naDefault: STATE_NA.desktop };
const na = { disabled: 'no disabled control: the only disabled state is the Printing button, shown as a variant', error: 'the tables page error state (red alert icon and message) is a separate full-page state, not part of this component', loading: 'spinner placeholders are shown as the printing variant where the source animates', empty: 'the no-tables state is a page state and is not part of this component' };
const T = (n) => TABLES[n - 1];

const card = (p, v) => tableCard({ v, t: T(p.t), id: 'pos-table-card-v16.card', menu: p.menu || null, hover: !!p.hover, merged: !!p.merged, printing: !!p.printing, hoverBtn: !!p.hoverBtn, lock: p.lock ?? T(p.t).lock });
const cardSpec = {
  ...base, id: 'pos-table-card-v16', name: 'POS table card (v16)', width: 276, css: TABLES_CSS, ...specSlots(CARD_KEYS),
  props: { t: 1 }, render: (v, p) => cardStage(card(p, v)),
  describe: ['Table card of the POS Tables grid (TableCard): shape icon, name, status badge, actions trigger, room, started-at and seats rows, reservation strip and the Preview / Print footer, min-height 248 with a 2px state border.', 'One card per table in the Tables route; green when available, amber when occupied, primary blue when held by a reservation lock.'],
  na, variants: {
    occupied: { props: { t: 2 }, describe: 'Occupied: amber-50 bg, amber-400 border, amber-900 text, Occupied badge, started-at time and the Preview / Print footer with an amber-200 divider.' },
    reserved: { props: { t: 3 }, describe: 'Available but locked by a confirmed reservation: primary-50 bg, primary-400 border, Reserved badge and the Reserved for strip.' },
    'occupied-reserved': { props: { t: 2, lock: true }, describe: 'Occupied table that also has a lock-window reservation: occupied colours with both the Occupied and Reserved badges and the strip.' },
    'take-away': { props: { t: 8 }, describe: 'Take-away table: pending Take away badge under the seats row.' },
    merged: { props: { t: 6, merged: true }, describe: 'Member of a merged group: the With T6 + T7 line in primary-700 above the rows.' },
    'shape-circle': { props: { t: 1 }, describe: 'Circle shape icon (table_shape Circle).' },
    'shape-square': { props: { t: 9 }, describe: 'Square shape icon (table_shape Square).' },
    'shape-rectangle': { props: { t: 4 }, describe: 'Rectangle shape icon (table_shape Rectangle, also the fallback).' },
    'menu-available': { props: { t: 1, menu: ['reserve', 'merge'] }, describe: 'Actions menu open on an available table: card lifted to z-20 with the Reserve and Merge tables popover.' },
    'menu-occupied': { props: { t: 2, menu: ['merge', 'transfer', 'captain'] }, describe: 'Actions menu open on an occupied table: Merge tables, Transfer table and Transfer captain.' },
    printing: { props: { t: 2, printing: true }, describe: 'Print in progress: spinner and Printing... label, button dimmed to 60%.' },
    'hover-available': { props: { t: 1, hover: true }, describe: 'Hover on an available card: emerald-400 border and shadow-md.' },
    'hover-reserved': { props: { t: 3, hover: true }, describe: 'Hover on a reserved card: primary-500 border and shadow-md.' },
    'hover-footer-button': { props: { t: 2, hoverBtn: true }, describe: 'Hover on the Preview button of an occupied card: amber-100 background.' },
  },
};
cardSpec.variants['shape-circle'].props = { t: 1 };

const legendSpec = {
  ...base, id: 'pos-tables-legend', name: 'POS tables legend', width: 1440, css: TABLES_CSS, ...specSlots(LEGEND_KEYS),
  props: { reservations: true }, render: (v, p) => legend({ v, reservations: p.reservations }),
  describe: ['Status legend bar of the Tables route: Available, Occupied, Merged and Reserved with 16px swatches in colours that match the cards.', 'Pinned 72px above the footer navigation; the Reserved entry appears only when the branch enables reservations.'],
  na: { ...na, error: 'static legend', loading: 'static legend' },
  variants: { 'no-reservations': { props: { reservations: false }, describe: 'Branch has reservations disabled: the Reserved swatch is omitted.' } },
};

const menuSpec = {
  ...base, id: 'pos-table-actions-menu', name: 'POS table actions menu', width: 256, css: TABLES_CSS, ...specSlots(MENU_KEYS),
  props: { items: ['merge', 'transfer', 'captain'] }, render: (v, p) => actionsMenu({ v, items: p.items, hover: !!p.hover }),
  describe: ['Table actions popover (TableActionsMenu): w-48 card under the three-dot trigger with Merge tables, Transfer table, Transfer captain, plus Reserve and Unmerge tables when they apply.', 'Opened from the more button of a table card; occupied tables get transfer actions, available tables get Reserve and, when merged, Unmerge.'],
  na: { ...na, error: 'static menu', loading: 'static menu' },
  variants: {
    available: { props: { items: ['reserve', 'merge'] }, describe: 'Available table with reservations enabled: Reserve and Merge tables.' },
    'available-merged': { props: { items: ['reserve', 'merge', 'unmerge'] }, describe: 'Available merged table: adds a divider and the red Unmerge tables item.' },
    'no-captain': { props: { items: ['merge', 'transfer'] }, describe: 'Occupied table where captain transfer is disabled in the branch.' },
    'hover-item': { props: { items: ['merge', 'transfer', 'captain'], hover: true }, describe: 'Trigger button hovered.' },
  },
};

const viewSpec = {
  ...base, id: 'pos-layout-view', name: 'POS layout view', width: 1440, css: TABLES_CSS, ...specSlots(LAYOUT_KEYS),
  props: { roomKey: 'a' }, render: (v, p) => layoutView({ v, roomKey: p.roomKey, edit: !!p.edit, selected: p.selected || null, panel: !!p.panel, hoverTable: p.hoverTable || null, style: 'height:700px' }),
  describe: ['Floor-plan layout of one room (LayoutView): header with the Grid View button, the Room | Layout title and the Edit Layout toggle, the zoom column, the pan/zoom hint and the grid canvas with circle, square and rectangle tables sized by seat count.', 'Opened from the Layout View button of the Tables route to see or rearrange tables.'],
  na, variants: {
    edit: { props: { edit: true }, describe: 'Edit mode: toggle reads Finish Editing with the primary fill and Save icon, the move badge shows on every table and the Editing Layout hint appears.' },
    terrace: { props: { roomKey: 'b' }, values: { room_a: 'Terrace' }, rtlValues: { room_a: 'التراس' }, describe: 'Second room (Terrace) with tables T11 to T14.' },
    selected: { props: { selected: 2, panel: true }, describe: 'Occupied table selected: primary-600 ring and the Table Info side panel with position, size and the current bill.' },
    'selected-available': { props: { selected: 1, panel: true }, describe: 'Available table selected: Table Info panel without the bill block.' },
    'edit-selected': { props: { edit: true, selected: 2, panel: true }, describe: 'Edit mode with a selected table: Edit Table Settings panel with enabled capacity and shape fields.' },
    'hover-edit': { props: { edit: true, hoverTable: 3 }, describe: 'Edit mode hover on a table: primary-400 ring.' },
  },
};
viewSpec.variants.terrace.values = { room_a: 'Terrace' };

const sg = { ...specSlots(SCREEN_TABLES_KEYS) };
const screenTables = {
  ...base, id: 'pos-screen-tables', name: 'POS screen: tables grid', width: 1440, height: 900, css: SCREEN_CSS,
  slots: { ...sg.slots, ...hdrSlots() }, rtlValues: { ...sg.rtlValues, ...hdrRtl() },
  props: { reservations: true }, render: (v, p) => tablesScreen({ v, reservations: p.reservations, menuOn: p.menuOn || null, hoverOn: p.hoverOn || null }),
  describe: ['The Tables route at 1440x900: POS header, room tabs with occupied counts and the Layout View button, the gray-50 grid of five columns with a merged T6 + T7 group, the status legend and the footer navigation.', 'Default landing of the Tables tab in the POS for waiters and cashiers.'],
  na, variants: {
    'no-reservations': { props: { reservations: false }, describe: 'Branch without reservations: the reserved lock and the Reserved legend entry are absent.' },
    'menu-open': { props: { menuOn: 2 }, describe: 'Actions menu open on the occupied T2 card.' },
    'hover-card': { props: { hoverOn: 1 }, describe: 'Hover on the available T1 card.' },
  },
};
const lg = { ...specSlots(LAYOUT_KEYS) };
const screenLayout = {
  ...base, id: 'pos-screen-tables-layout', name: 'POS screen: tables layout', width: 1440, height: 900, css: SCREEN_CSS,
  slots: { ...lg.slots, ...hdrSlots() }, rtlValues: { ...lg.rtlValues, ...hdrRtl() },
  props: { roomKey: 'a' }, render: (v, p) => layoutScreen({ v, roomKey: p.roomKey, edit: !!p.edit, selected: p.selected || null, panel: !!p.panel }),
  describe: ['The Layout View of the Tables route at 1440x900 under the POS header and footer: header controls, zoom column, hint and the table floor plan.', 'Shown after pressing Layout View; used to read table status at a glance or edit the room layout.'],
  na, variants: {
    edit: { props: { edit: true }, describe: 'Edit mode with move badges and the Editing Layout hint.' },
    selected: { props: { selected: 2, panel: true }, describe: 'Selected occupied table with the Table Info panel.' },
    'edit-selected': { props: { edit: true, selected: 2, panel: true }, describe: 'Edit mode with the Edit Table Settings panel.' },
  },
};

export const specs = [cardSpec, legendSpec, viewSpec, menuSpec, screenTables, screenLayout];
