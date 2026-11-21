// POS reservations specs (T05): card, timeline, dialogs (create / edit / cancel / complete / warning) and the Reservations route (1440x900).
// Every UI label comes from LOC below, a verbatim copy of pos/src/i18n/locales/{en,ar}.json keys `reservations.*`, `tables.reserved_*`, `customer.search_placeholder`, `common.change`.
// Sample data (table codes, customer names, phone numbers, dates, notes) has no locale source: names, room and notes are translated by hand for the Arabic run.
// The weekday/month in the dates follow Intl 'ar' output (Latin digits), as the source formats with toLocaleString.
import { STATE_NA } from '../lib.mjs';
import { SHELL_SLOTS, SHELL_RTL, PLACEHOLDERS, HEADER_KEYS, FOOTER_KEYS, pick } from './shell.mjs';
import { RV_CSS, SCREEN_CSS, card, timeline, dialog, reservationsScreen } from './reservations.mjs';

const LOC = { en: {"reservations.page_title":"Reservations","reservations.all_rooms":"All Rooms","reservations.all_tables":"All Tables","reservations.previous_day":"Previous Day","reservations.next_day":"Next Day","reservations.filter_by_status":"Filter by Status","reservations.filter_all":"All","reservations.list_view":"List View","reservations.timeline_view":"Timeline View","reservations.loading_list":"Loading reservations...","reservations.empty_title":"No Reservations Found","reservations.empty_hint":"There are currently no reservations for {{date}} matching your selected filter.","reservations.table_label":"Table","reservations.table_option_label":"{{name}} ({{room}} - {{seats}} seats)","reservations.edit_action":"Edit Reservation","reservations.not_authorized_cancel":"Not authorized to cancel reservation","reservations.not_authorized_complete":"Not authorized to complete reservation","reservations.guest_count":"{{count}} guests","reservations.date_today":"Today, {{date}}","reservations.date_tomorrow":"Tomorrow, {{date}}","reservations.date_yesterday":"Yesterday, {{date}}","reservations.select_customer":"Please select a customer.","reservations.select_table":"Please select a table.","reservations.enter_phone":"Please enter the customer's phone number.","reservations.valid_pax":"Please enter a valid number of persons (minimum 1).","reservations.exceeds_capacity":"Number of persons cannot exceed the table capacity of {{capacity}}.","reservations.select_date":"Please select a reservation date.","reservations.select_time":"Please select a reservation time.","reservations.past_datetime":"Reservation date and time cannot be in the past.","reservations.reserve_failed":"Failed to reserve table.","reservations.reserve_success":"Table reserved successfully","reservations.update_failed":"Failed to update reservation.","reservations.seats":"{{count}} seats","reservations.customer_label":"Customer","reservations.customer_name_label":"Customer Name","reservations.phone_label":"Phone Number","reservations.phone_placeholder":"e.g. +1 555-0199","reservations.pax_label":"Number of Persons","reservations.date_label":"Reservation Date","reservations.time_label":"Reservation Time","reservations.notes_label":"Notes / Special Requests","reservations.notes_placeholder":"Special requests, occasion, dietary requirements...","reservations.notes_prefix":"Notes:","reservations.cancel":"Cancel","reservations.reserve_table":"Reserve Table","reservations.save_changes":"Save Changes","reservations.loading_tables":"Loading available tables...","reservations.no_available_tables":"No available tables","reservations.select_table_placeholder":"Select a table","reservations.no_tables_for_slot":"No tables are available for the selected date and time.","reservations.cancel_title":"Cancel Reservation","reservations.cancel_description":"Are you sure you want to cancel this reservation?","reservations.keep_reservation":"Keep Reservation","reservations.cancel_reservation":"Cancel Reservation","reservations.reservation_time_label":"Reservation Time","reservations.complete_title":"Complete Reservation","reservations.complete_description":"Confirm that the customer has arrived for table {{table}} at {{time}}.","reservations.complete_action":"Complete","reservations.warning_title":"Table Reserved","reservations.warning_description":"This table has an active reservation and is protected by buffer time.","reservations.choose_another":"Please choose another table.","reservations.choose_another_action":"Choose Another Table","reservations.status_confirmed":"Confirmed","reservations.status_active":"Active","reservations.status_requested":"Requested","reservations.status_completed":"Completed","reservations.status_cancelled":"Cancelled","reservations.status_no_show":"No Show","reservations.loading_timeline":"Loading timeline view...","reservations.empty_timeline_title":"No Reservations for this Date","reservations.empty_timeline_hint":"Reservations will appear along the time axis.","tables.reserved_badge":"Reserved","tables.reserved_for":"Reserved for {{time}}","customer.search_placeholder":"Search customer...","common.change":"Change"}, ar: {"reservations.page_title":"الحجوزات","reservations.all_rooms":"جميع القاعات","reservations.all_tables":"جميع الطاولات","reservations.previous_day":"اليوم السابق","reservations.next_day":"اليوم التالي","reservations.filter_by_status":"تصفية حسب الحالة","reservations.filter_all":"الكل","reservations.list_view":"عرض القائمة","reservations.timeline_view":"عرض الجدول الزمني","reservations.loading_list":"جارٍ تحميل الحجوزات...","reservations.empty_title":"لم يتم العثور على حجوزات","reservations.empty_hint":"لا توجد حجوزات حالياً لتاريخ {{date}} تطابق الفلاتر المحددة.","reservations.table_label":"الطاولة","reservations.table_option_label":"{{name}} ({{room}} - {{seats}} مقاعد)","reservations.edit_action":"تعديل الحجز","reservations.not_authorized_cancel":"غير مصرح لك بإلغاء الحجز","reservations.not_authorized_complete":"غير مصرح لك بإتمام الحجز","reservations.guest_count":"{{count}} ضيوف","reservations.date_today":"اليوم، {{date}}","reservations.date_tomorrow":"غداً، {{date}}","reservations.date_yesterday":"أمس، {{date}}","reservations.select_customer":"يرجى اختيار عميل.","reservations.select_table":"يرجى اختيار طاولة.","reservations.enter_phone":"يرجى إدخال رقم هاتف العميل.","reservations.valid_pax":"يرجى إدخال عدد أشخاص صالح (الحد الأدنى 1).","reservations.exceeds_capacity":"لا يمكن أن يتجاوز عدد الأشخاص سعة الطاولة البالغة {{capacity}}.","reservations.select_date":"يرجى اختيار تاريخ الحجز.","reservations.select_time":"يرجى اختيار وقت الحجز.","reservations.past_datetime":"لا يمكن أن يكون تاريخ ووقت الحجز في الماضي.","reservations.reserve_failed":"فشل حجز الطاولة.","reservations.reserve_success":"تم حجز الطاولة بنجاح","reservations.update_failed":"فشل تحديث الحجز.","reservations.seats":"{{count}} مقاعد","reservations.customer_label":"العميل","reservations.customer_name_label":"اسم العميل","reservations.phone_label":"رقم الهاتف","reservations.phone_placeholder":"مثال: +966 5X XXX XXXX","reservations.pax_label":"عدد الأشخاص","reservations.date_label":"تاريخ الحجز","reservations.time_label":"وقت الحجز","reservations.notes_label":"ملاحظات / طلبات خاصة","reservations.notes_placeholder":"طلبات خاصة، مناسبة، متطلبات غذائية...","reservations.notes_prefix":"ملاحظات:","reservations.cancel":"إلغاء","reservations.reserve_table":"حجز الطاولة","reservations.save_changes":"حفظ التغييرات","reservations.loading_tables":"جارٍ تحميل الطاولات المتاحة...","reservations.no_available_tables":"لا توجد طاولات متاحة","reservations.select_table_placeholder":"اختر طاولة","reservations.no_tables_for_slot":"لا توجد طاولات متاحة للتاريخ والوقت المحددين.","reservations.cancel_title":"إلغاء الحجز","reservations.cancel_description":"هل أنت متأكد من أنك تريد إلغاء هذا الحجز؟","reservations.keep_reservation":"الاحتفاظ بالحجز","reservations.cancel_reservation":"إلغاء الحجز","reservations.reservation_time_label":"وقت الحجز","reservations.complete_title":"إتمام الحجز","reservations.complete_description":"أكد وصول العميل للطاولة {{table}} في {{time}}.","reservations.complete_action":"إتمام","reservations.warning_title":"الطاولة محجوزة","reservations.warning_description":"هذه الطاولة لديها حجز نشط ومحمية بوقت التمهيد.","reservations.choose_another":"يرجى اختيار طاولة أخرى.","reservations.choose_another_action":"اختيار طاولة أخرى","reservations.status_confirmed":"مؤكد","reservations.status_active":"نشط","reservations.status_requested":"مطلوب","reservations.status_completed":"مكتمل","reservations.status_cancelled":"ملغي","reservations.status_no_show":"لم يحضر","reservations.loading_timeline":"جارٍ تحميل الجدول الزمني...","reservations.empty_timeline_title":"لا توجد حجوزات لهذا التاريخ","reservations.empty_timeline_hint":"ستظهر الحجوزات على طول المحور الزمني.","tables.reserved_badge":"محجوزة","tables.reserved_for":"محجوزة لـ {{time}}","customer.search_placeholder":"ابحث عن عميل...","common.change":"تغيير"} };
const tr = (loc, key, params = {}) => { const s = LOC[loc][key]; if (s == null) throw new Error('reservations.spec: missing locale key ' + key); return s.replace(/\{\{(\w+)\}\}/g, (_, k) => String(params[k])); };
const L = (key, params = {}, arParams = params) => [tr('en', key, params), tr('ar', key, arParams)];
const split = (o) => ({ slots: Object.fromEntries(Object.entries(o).map(([k, [en]]) => [k, en])), rtlValues: Object.fromEntries(Object.entries(o).map(([k, [en, ar]]) => [k, ar === undefined ? en : ar])) });
const merge = (...parts) => ({ slots: Object.assign({}, ...parts.map((p) => p.slots)), rtlValues: Object.assign({}, ...parts.map((p) => p.rtlValues)) });

const base = { group: 'pos', static: true, dsf: 2, canvas: 'hsl(var(--background))', css: RV_CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };
const na = { loading: 'shown as the loading variant where the source renders one', disabled: 'shown in the loading / submitting variants where the controls are disabled', error: 'shown as the error variant where the source renders one', empty: 'shown as the empty variant where the source renders one' };

/* ---- shared texts ---- */
const STATUS_T = split({
  status_confirmed: L('reservations.status_confirmed'), status_active: L('reservations.status_active'), status_requested: L('reservations.status_requested'),
  status_completed: L('reservations.status_completed'), status_cancelled: L('reservations.status_cancelled'), status_no_show: L('reservations.status_no_show'),
});
const TABLE_LABEL = split({ table_label: L('reservations.table_label') });

/* ---- sample reservations (cards) ---- */
const WHEN = (t) => [`Sat, Nov 21, ${t}`, `السبت، 21 نوفمبر، ${t.replace('PM', 'م').replace('AM', 'ص')}`];
const RES = [
  { n: 'c1', table: 'T-03', status: 'Confirmed', name: ['Rashid Mansoor', 'راشد منصور'], phone: '+971 50 123 4567', pax: 4, when: WHEN('07:30 PM') },
  { n: 'c2', table: 'T-07', status: 'Active', name: ['Layla Haddad', 'ليلى حداد'], phone: '+971 55 234 5678', pax: 2, when: WHEN('08:00 PM'), notes: ['Window seat, celebrating a promotion', 'مقعد بجانب النافذة، احتفالاً بترقية'] },
  { n: 'c3', table: 'T-12', status: 'Requested', name: ['Omar Siddiqui', 'عمر صديقي'], phone: '+971 52 345 6789', pax: 6, when: WHEN('08:30 PM') },
  { n: 'c4', table: 'T-05', status: 'Completed', name: ['Noor Al Jaber', 'نور الجابر'], phone: '+971 56 456 7890', pax: 2, when: WHEN('12:30 PM') },
  { n: 'c5', table: 'T-09', status: 'Confirmed', name: ['Youssef Karam', 'يوسف كرم'], phone: '+971 50 567 8901', pax: 8, when: WHEN('09:00 PM'), notes: ['Anniversary dinner, please prepare a small cake', 'عشاء ذكرى زواج، يرجى تجهيز كعكة صغيرة'] },
  { n: 'c6', table: 'T-01', status: 'Cancelled', name: ['Mariam Saleh', 'مريم صالح'], phone: '+971 54 678 9012', pax: 3, when: WHEN('06:00 PM') },
  { n: 'c7', table: 'T-04', status: 'No Show', name: ['Faisal Nasser', 'فيصل ناصر'], phone: '+971 58 789 0123', pax: 5, when: WHEN('01:15 PM') },
  { n: 'c8', table: 'T-02', status: 'Confirmed', name: ['Hind Rahman', 'هند الرحمن'], phone: '+971 50 890 1234', pax: 2, when: WHEN('10:00 PM') },
];
const resText = (rows) => split(Object.fromEntries(rows.flatMap((r) => [
  [`${r.n}_table`, [r.table]], [`${r.n}_name`, r.name], [`${r.n}_phone`, [r.phone]],
  [`${r.n}_guests`, L('reservations.guest_count', { count: r.pax })], [`${r.n}_when`, r.when],
  ...(r.notes ? [[`${r.n}_notes`, r.notes]] : []),
])));
const MENU_T = split({ menu_edit: L('reservations.edit_action'), menu_complete: L('reservations.complete_title'), menu_cancel: L('reservations.cancel_title') });
const cardProps = (r, extra = {}) => ({ n: r.n, status: r.status, ...extra });

const cardText = merge(STATUS_T, TABLE_LABEL, MENU_T, resText([{ ...RES[0], notes: ['Window seat, birthday dinner', 'مقعد بجانب النافذة، عشاء عيد ميلاد'] }]));
const cardSpec = {
  ...base, id: 'pos-reservation-card', name: 'POS reservation card', width: 336, ...cardText,
  props: { n: 'c1', status: 'Confirmed' },
  render: (v, p) => card(v, p),
  describe: ['Reservation list card (Card + CardContent p-5): TABLE label and table name, status badge, a three-dot action menu, and customer, phone, guest count and reservation time rows.', 'One card per reservation in the Reservations list view; the grid is 4 columns with a 16px gap at 1440px.'],
  na, naDefault: STATE_NA.desktop,
  variants: {
    active: { props: { status: 'Active' }, describe: 'Active status: warning badge.' },
    requested: { props: { status: 'Requested' }, describe: 'Requested status: outline badge.' },
    completed: { props: { status: 'Completed' }, describe: 'Completed status: primary-100 badge, no action menu button (only Confirmed, Active and Requested are actionable).' },
    cancelled: { props: { status: 'Cancelled' }, describe: 'Cancelled status: destructive tint badge, no action menu button.' },
    'no-show': { props: { status: 'No Show' }, describe: 'No Show status: orange-100 / orange-800 badge, no action menu button.' },
    'menu-open': { props: { menu: true }, describe: 'Action menu open (w-48): Edit Reservation, Complete Reservation and Cancel Reservation (manager or cashier).' },
    'menu-requested': { props: { status: 'Requested', menu: true }, describe: 'Requested reservations cannot be completed: the menu lists Edit and Cancel only.' },
    'kebab-hover': { props: { kebabHover: true }, describe: 'Pointer over the three-dot button: gray-100 background.' },
    hover: { props: { hover: true }, describe: 'Pointer over the card: border-gray-300.' },
    'with-notes': { props: { notes: true }, describe: 'Comments shown as an italic quote (line-clamp-2) under a gray-50 rule.' },
    'no-phone': { props: { phone: false }, describe: 'Customer without a phone number: the phone row is omitted.' },
  },
};

/* ---- timeline ---- */
const TL = [
  { n: 'r1', table: 'T-05', status: 'Completed', start: 600, dur: 60, name: ['Noor Al Jaber', 'نور الجابر'], pax: 2, phone: '+971 56 456 7890' },
  { n: 'r2', table: 'T-03', status: 'Confirmed', start: 720, dur: 90, name: ['Rashid Mansoor', 'راشد منصور'], pax: 4, phone: '+971 50 123 4567' },
  { n: 'r3', table: 'T-07', status: 'Active', start: 750, dur: 60, name: ['Layla Haddad', 'ليلى حداد'], pax: 2, phone: '+971 55 234 5678' },
  { n: 'r4', table: 'T-12', status: 'Requested', start: 810, dur: 60, name: ['Omar Siddiqui', 'عمر صديقي'], pax: 6, phone: '+971 52 345 6789' },
  { n: 'r5', table: 'T-09', status: 'Cancelled', start: 840, dur: 60, name: ['Mariam Saleh', 'مريم صالح'], pax: 3, phone: '+971 54 678 9012' },
  { n: 'r6', table: 'T-04', status: 'No Show', start: 930, dur: 90, name: ['Faisal Nasser', 'فيصل ناصر'], pax: 5, phone: '+971 58 789 0123' },
  { n: 'r7', table: 'T-02', status: 'Confirmed', start: 1140, dur: 120, name: ['Hind Rahman', 'هند الرحمن'], pax: 2, phone: '+971 50 890 1234' },
];
const hm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const tlText = split(Object.fromEntries(TL.flatMap((r) => [
  [`${r.n}_table`, [r.table]], [`${r.n}_time`, [hm(r.start)]], [`${r.n}_end`, [hm(r.start + r.dur)]], [`${r.n}_name`, r.name], [`${r.n}_pax`, [String(r.pax)]], [`${r.n}_phone`, [r.phone]],
])));
const TL_EMPTY = split({ empty_timeline_title: L('reservations.empty_timeline_title'), empty_timeline_hint: L('reservations.empty_timeline_hint'), loading_timeline: L('reservations.loading_timeline') });
const tlItems = TL.map(({ n, status, start, dur }) => ({ n, status, start, dur }));
const TL_SCROLL = 1200;
const timelineSpec = {
  ...base, id: 'pos-reservation-timeline', name: 'POS reservation timeline', width: 1392, ...merge(STATUS_T, tlText, TL_EMPTY),
  props: { items: tlItems, scroll: TL_SCROLL, h: 459 },
  render: (v, p) => timeline(v, p),
  describe: ['Horizontal day timeline (TableReservationTimeline): an hour axis of 24 columns x 120px, half-hour dashed rules, and one 74px block per reservation, coloured by status and stacked into lanes when they overlap.', 'The Timeline view of the Reservations route; shown scrolled to mid-day (the source scrolls to the current time on today).'],
  na, naDefault: STATE_NA.desktop,
  variants: {
    'block-hover': { props: { hover: 'r2' }, describe: 'Pointer over a block: z-40, shadow-xl, scale 1.01 and a status-coloured ring.' },
    'scrolled-start': { props: { scroll: 0 }, describe: 'Scrolled to 00:00 (any date other than today).' },
    empty: { props: { items: [] }, describe: 'No reservations on the date: BookLock chip with title and hint centred in the canvas.' },
    loading: { props: { loading: true, h: 459 }, describe: 'Loading timeline view... centred message (h-80).' },
  },
};

/* ---- dialogs ---- */
const DLG = split({
  table: ['T-07'], seats: L('reservations.seats', { count: 4 }), search_placeholder: L('customer.search_placeholder'),
  customer_label: L('reservations.customer_label'), customer_name: ['Rashid Mansoor', 'راشد منصور'], customer_name_label: L('reservations.customer_name_label'), customer_phone: ['+971 50 123 4567'],
  change: L('common.change'), phone_label: L('reservations.phone_label'), phone_placeholder: L('reservations.phone_placeholder'),
  pax_label: L('reservations.pax_label'), pax: ['4'], date_label: L('reservations.date_label'), date: ['21-11-2026'], time_label: L('reservations.time_label'), time: ['07:30 PM', '07:30 م'],
  notes_label: L('reservations.notes_label'), notes_placeholder: L('reservations.notes_placeholder'), notes_val: ['Birthday dinner, window seat if possible', 'عشاء عيد ميلاد، مقعد بجانب النافذة إن أمكن'],
  btn_cancel: L('reservations.cancel'), btn_reserve: L('reservations.reserve_table'), btn_save: L('reservations.save_changes'),
  error: L('reservations.exceeds_capacity', { capacity: 4 }),
  table_label: L('reservations.table_label'), table_option: [tr('en', 'reservations.table_option_label', { name: 'T-07', room: 'Main Hall', seats: 4 }), tr('ar', 'reservations.table_option_label', { name: 'T-07', room: 'القاعة الرئيسية', seats: 4 })],
  loading_tables: L('reservations.loading_tables'), no_available_tables: L('reservations.no_available_tables'), no_tables_for_slot: L('reservations.no_tables_for_slot'),
  cancel_title: L('reservations.cancel_title'), cancel_description: L('reservations.cancel_description'), reserved_badge: L('tables.reserved_badge'),
  guests: L('reservations.guest_count', { count: 4 }), reservation_time_label: L('reservations.reservation_time_label'), time_raw: ['2026-11-21 19:30:00'],
  keep_reservation: L('reservations.keep_reservation'), cancel_reservation: L('reservations.cancel_reservation'),
  complete_title: L('reservations.complete_title'), complete_description: [tr('en', 'reservations.complete_description', { table: 'T-07', time: '07:30 PM' }), tr('ar', 'reservations.complete_description', { table: 'T-07', time: '07:30 م' })],
  time_short: ['07:30 PM', '07:30 م'], complete_action: L('reservations.complete_action'),
  warning_title: L('reservations.warning_title'), warning_description: L('reservations.warning_description'),
  reserved_for: [tr('en', 'tables.reserved_for', { time: '7:30 PM' }), tr('ar', 'tables.reserved_for', { time: '7:30 م' })], choose_another: L('reservations.choose_another'),
  time_warn: ['7:30 PM', '7:30 م'], notes_prefix: L('reservations.notes_prefix'), choose_another_action: L('reservations.choose_another_action'),
});
const dialogSpec = {
  ...base, id: 'pos-reservation-dialog', name: 'POS reservation dialog', width: 1440, height: 900, ...merge(DLG, STATUS_T),
  props: { kind: 'create' },
  render: (v, p) => dialog(v, p),
  describe: ['Table reservation dialogs over a bg-black/50 scrim: Reserve Table (create, max-w-2xl, h-740), Edit (h-840, with a table select), Cancel Reservation, Complete Reservation (customer arrived) and the Table Reserved buffer-time warning.', 'Opened from the Tables screen (create, warning) and from the card menu of the Reservations route (edit, complete, cancel).'],
  na, naDefault: STATE_NA.desktop,
  variants: {
    edit: { props: { kind: 'edit' }, describe: 'TableReservationEditDialog: same form with a Table select first and a Save Changes button (h-840, clamped by max-h-90vh).' },
    cancel: { props: { kind: 'cancel' }, describe: 'TableReservationCancelDialog (max-w-xl): red-50 summary card with customer, phone, guests and time; Keep Reservation / Cancel Reservation footer.' },
    complete: { props: { kind: 'complete' }, describe: 'TableReservationCompleteDialog (max-w-xl): blue summary card with a Confirmed badge and a blue Complete button.' },
    warning: { props: { kind: 'warning' }, describe: 'TableReservationWarningDialog (max-w-lg): amber buffer-time banner, indigo reservation card and Choose Another Table.' },
    'create-empty': { props: { kind: 'create', noCustomer: true }, describe: 'No customer chosen yet: customer search field, empty phone with its placeholder and the Reserve Table button disabled.' },
    'create-notes': { props: { kind: 'create', notes: true }, describe: 'Notes textarea filled instead of showing its placeholder.' },
    'create-error': { props: { kind: 'create', error: true }, describe: 'Validation error box (red-50) above the form card.' },
    'create-submitting': { props: { kind: 'create', off: true }, describe: 'Submitting: inputs and both buttons disabled.' },
    'edit-no-tables': { props: { kind: 'edit', tables: 'none' }, describe: 'No table free for the chosen slot: placeholder No available tables and the amber hint.' },
    'edit-loading-tables': { props: { kind: 'edit', tables: 'loading' }, describe: 'Loading available tables... placeholder in the Table select.' },
    'cancel-loading': { props: { kind: 'cancel', off: true }, describe: 'Cancellation in progress: both buttons disabled.' },
    'complete-loading': { props: { kind: 'complete', off: true }, describe: 'Completion in progress: both buttons disabled.' },
  },
};

/* ---- screen ---- */
const SCREEN_T = split({
  page_title: L('reservations.page_title'), count: ['8'], all_rooms: L('reservations.all_rooms'), all_tables: L('reservations.all_tables'),
  previous_day: L('reservations.previous_day'), next_day: L('reservations.next_day'),
  date_text: [tr('en', 'reservations.date_today', { date: 'Nov 21' }), tr('ar', 'reservations.date_today', { date: '21 نوفمبر' })],
  filter_all: L('reservations.filter_all'), list_view: L('reservations.list_view'), timeline_view: L('reservations.timeline_view'),
  loading_list: L('reservations.loading_list'), empty_title: L('reservations.empty_title'),
  empty_hint: [tr('en', 'reservations.empty_hint', { date: tr('en', 'reservations.date_today', { date: 'Nov 21' }) }), tr('ar', 'reservations.empty_hint', { date: tr('ar', 'reservations.date_today', { date: '21 نوفمبر' }) })],
});
const shellKeys = [...HEADER_KEYS, ...FOOTER_KEYS];
const SHELL_T = { slots: { ...pick(SHELL_SLOTS, shellKeys), search_placeholder: PLACEHOLDERS.reservations[0] }, rtlValues: { ...pick(SHELL_RTL, shellKeys.filter((k) => k in SHELL_RTL)), search_placeholder: PLACEHOLDERS.reservations[1] } };
const screenText = merge(SHELL_T, SCREEN_T, STATUS_T, TABLE_LABEL, MENU_T, resText(RES), tlText, TL_EMPTY);
const allCards = RES.map((r) => ({ n: r.n, status: r.status, notes: !!r.notes }));
const screenSpec = {
  ...base, id: 'pos-screen-reservations', name: 'POS reservations screen', width: 1440, height: 900, css: SCREEN_CSS, ...screenText,
  props: { view: 'list', state: 'list', statusAll: true, cards: allCards },
  render: (v, p) => reservationsScreen(v, p),
  describe: ['The Reservations route in the POS shell: header strip (BookLock chip, title with count pill, room and table selects, date stepper, status select, List / Timeline toggle) over a 4-column grid of reservation cards.', 'Opened from the Reservations tab of the footer navigation when the branch enables table reservations.'],
  na, naDefault: STATE_NA.desktop,
  variants: {
    'filter-confirmed': { props: { statusAll: false, cards: allCards.filter((c) => c.status === 'Confirmed') }, values: { count: '3' }, describe: 'Default Confirmed status filter: only confirmed reservations.' },
    'menu-open': { props: { menu: { n: 'c2' } }, describe: 'Three-dot menu open on an Active reservation card.' },
    empty: { props: { state: 'empty', cards: [] }, values: { count: '0' }, describe: 'List view with no reservations: p-4 gray-100 round BookLock, title and hint.' },
    loading: { props: { state: 'loading', cards: [] }, values: { count: '0' }, describe: 'Loading reservations... centred in the list area.' },
    timeline: { props: { view: 'timeline', tlItems, scroll: TL_SCROLL }, describe: 'Timeline view: the toggle switches to the CalendarClock button and the day timeline fills the content area.' },
    'timeline-empty': { props: { view: 'timeline', tlItems: [], scroll: 0 }, values: { count: '0' }, describe: 'Timeline view with no reservations for the date.' },
    'timeline-loading': { props: { view: 'timeline', state: 'loading' }, values: { count: '0' }, describe: 'Timeline view while loading.' },
  },
};
export const specs = [cardSpec, timelineSpec, dialogSpec, screenSpec];
