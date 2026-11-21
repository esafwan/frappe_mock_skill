// POS misc screens: open entries, settings, screen-size dialog, initial loader, toasts.
// Arabic: fixed UI labels from pos/src/i18n/locales/ar.json (open_entries.*, settings.*, screen_size.*, common.*). Sample data (users, profiles, dates, toast
// messages) has no Arabic source and is translated by hand; "current_width" interpolates {{px}} = 1280 by hand. Toast messages are backend-supplied text.
import { STATE_NA } from '../lib.mjs';
import { SHELL_CSS, SHELL_SLOTS, SHELL_RTL, HEADER_KEYS, FOOTER_KEYS, pick } from './shell.mjs';
import { openEntriesScreen, settingsScreen, screenSizeDialog, initialLoader, toastStage } from './misc.mjs';

const CSS = [...SHELL_CSS, 'ury-v16/components/pos-misc.css'];
const base = { width: 1440, height: 900, dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], group: 'pos', static: true, naDefault: STATE_NA.desktop };
const split = (o) => ({ slots: Object.fromEntries(Object.entries(o).map(([k, [en]]) => [k, en])), rtlValues: Object.fromEntries(Object.entries(o).map(([k, [en, ar]]) => [k, ar === undefined ? en : ar])) });
const shellKeys = [...HEADER_KEYS, ...FOOTER_KEYS];
const withShell = (o) => { const s = split(o); return { slots: { ...pick(SHELL_SLOTS, shellKeys), ...s.slots }, rtlValues: { ...pick(SHELL_RTL, shellKeys.filter((k) => k in SHELL_RTL)), ...s.rtlValues } }; };

const OE = {
  title: ['Open Sessions', 'الجلسات المفتوحة'], col_user: ['User', 'المستخدم'], col_period_start: ['Session Start', 'بداية الجلسة'], col_pos_profile: ['POS Profile', 'ملف نقطة البيع'],
  no_sessions: ['No open sessions right now', 'لا توجد جلسات مفتوحة حالياً'], error_load: ['Failed to load open sessions', 'تعذّر تحميل الجلسات المفتوحة'], loading: ['Loading...', 'جاري التحميل...'],
  u1: ['sara@example.com', 'sara@example.com'], u2: ['omar@example.com', 'omar@example.com'], u3: ['layla@example.com', 'layla@example.com'],
  d1: ['Nov 21, 2026, 09:30 AM', '21 نوفمبر 2026، 09:30 ص'], d2: ['Nov 21, 2026, 10:05 AM', '21 نوفمبر 2026، 10:05 ص'], d3: ['Nov 21, 2026, 11:15 AM', '21 نوفمبر 2026، 11:15 ص'],
  pr1: ['Counter 1', 'الكاونتر 1'], pr2: ['Counter 2', 'الكاونتر 2'], pr3: ['Bar', 'البار'],
};
const ST = {
  title: ['Settings', 'الإعدادات'], end_of_day: ['End of Day', 'نهاية اليوم'],
  close_pos_title: ['Close POS Session', 'إغلاق جلسة نقاط البيع'], close_pos_description: ["Reconcile your cash drawer and close out today's POS session for this device.", 'قم بمطابقة درج النقد الخاص بك وأغلق جلسة نقاط البيع لهذا الجهاز اليوم.'],
  close_pos_button: ['Close POS / End Shift', 'إغلاق نقاط البيع / إنهاء الوردية'], coming_soon: ['More settings coming soon.', 'المزيد من الإعدادات قريبًا.'],
  confirm_title: ["Close today's POS session?", 'هل تريد إغلاق جلسة نقاط البيع لهذا اليوم؟'],
  confirm_description: ['This will end your current session and cannot be undone. Make sure all orders are settled before continuing.', 'سيؤدي هذا إلى إنهاء جلستك الحالية ولا يمكن التراجع عنه. تأكد من تسوية جميع الطلبات قبل المتابعة.'],
  confirm_button: ['Yes, Close Session', 'نعم، أغلق الجلسة'], confirm_cancel: ['Cancel', 'إلغاء'],
  closed_title: ['Session Closed', 'تم إغلاق الجلسة'], closed_description: ['Your POS session has been closed successfully.', 'تم إغلاق جلسة نقاط البيع بنجاح.'], back_to_dashboard: ['Back to Dashboard', 'العودة إلى لوحة التحكم'],
};
const SS = {
  title: ['Desktop Only', 'لسطح المكتب فقط'], designed_for: ['This POS system is designed for desktop computers and tablets with larger screens.', 'تم تصميم نظام نقطة البيع هذا لأجهزة سطح المكتب والأجهزة اللوحية ذات الشاشات الأكبر.'],
  mobile_note: ['Mobile support will be available in a future update. Please use a device with a screen width of 1024px or larger.', 'سيتوفر دعم الأجهزة المحمولة في تحديث قادم. يرجى استخدام جهاز بعرض شاشة 1024px أو أكبر.'],
  current_width: ['Current screen width: 1280px', 'عرض الشاشة الحالي: 1280px'], required: ['Required: 1024px or larger', 'المطلوب: 1024px أو أكبر'],
  use_v1: ['You can use URY POS Version 1 for mobile devices.', 'يمكنك استخدام الإصدار 1 من URY POS للأجهزة المحمولة.'], switch_v1: ['Switch to Version 1', 'التبديل إلى الإصدار 1'],
};
const IL = {
  loading: ['Loading...', 'جاري التحميل...'], loading_ury_pos: ['Loading URY POS...', 'جاري تحميل URY POS...'], please_wait_setup: ['Please wait while we set things up', 'يرجى الانتظار بينما نقوم بضبط الأشياء...'],
};
const TO = {
  msg_error: ['KOT failed for table 4: Kitchen printer is offline.', 'فشل أمر المطبخ للطاولة 4: طابعة المطبخ غير متصلة.'],
  msg_success: ['Order sent to the kitchen.', 'تم إرسال الطلب إلى المطبخ.'],
  msg_warning: ['Some items are low in stock.', 'بعض الأصناف قاربت على النفاد.'],
  msg_info: ['Order updated by another cashier.', 'تم تحديث الطلب بواسطة كاشير آخر.'],
};
const na = { hover: STATE_NA.desktop, focus: STATE_NA.desktop, active: STATE_NA.desktop };

export const specs = [
  { ...base, id: 'pos-screen-open-entries', name: 'POS open sessions screen', ...withShell(OE), props: {}, na,
    render: (v, p) => openEntriesScreen(v, p, 'pos-screen-open-entries'),
    describe: ['Open Sessions page (OpenEntries) inside the POS shell: gray-50 page, max-w 1152 content, 24/600 title and a white card with a User / Session Start / POS Profile table.', 'Reached from the Sessions tab to see every open POS Opening Entry for the profile.'],
    variants: {
      empty: { props: { state: 'empty' }, describe: 'No open entries: centred "No open sessions right now".' },
      error: { props: { state: 'error' }, describe: 'Fetch failed: red error line in the card.' },
      loading: { props: { state: 'loading' }, describe: 'Fetching: centred spinner in the card.' },
      'row-hover': { props: { hover: true }, describe: 'Hover on a table row: bg-gray-50.' },
    } },
  { ...base, id: 'pos-screen-settings', name: 'POS settings screen', ...withShell(ST), props: {}, na,
    render: (v, p) => settingsScreen(v, p, 'pos-screen-settings'),
    describe: ['Settings page inside the POS shell: End of Day heading, Close POS card with the Close POS / End Shift danger button, and a "More settings coming soon." placeholder card (max-w 448).', 'Where a cashier voluntarily ends the shift.'],
    variants: {
      confirm: { props: { state: 'confirm' }, describe: "Confirm dialog \"Close today's POS session?\" with Cancel / Yes, Close Session over the page." },
      closed: { props: { state: 'closed' }, describe: 'After closing: Session Closed card with green check and Back to Dashboard.' },
    } },
  { ...base, id: 'pos-screen-size-dialog', name: 'POS screen size dialog', ...withShell(SS), props: {}, na: { ...na, disabled: 'not styled in source' },
    render: (v, p) => screenSizeDialog(v, p, 'pos-screen-size-dialog'),
    describe: ['Blocking dialog shown when the window is narrower than 1024px: 64px blue icon circle, Desktop Only title, current/required width and a Switch to Version 1 button (max-w 448, r8, p32).', 'Shown on phones; points to URY POS v1.'],
    variants: { 'button-hover': { props: { hover: true }, describe: 'Hover on Switch to Version 1: blue-700.' } } },
  { ...base, id: 'pos-initial-loader', name: 'POS initial loader', ...split(IL), props: {}, na: { ...na, disabled: 'n/a', hover: 'no interactive controls' },
    render: (v, p) => initialLoader(v, p, 'pos-initial-loader'),
    describe: ['Full-screen app loader: 48px primary spinner (static frame), Loading URY POS... and a wait line on white.', 'Shown while the POS app bootstraps its session and profile.'],
    variants: {} },
  { ...base, id: 'pos-toast', name: 'POS toast', width: 344, height: 0, ...split(TO), props: { kinds: ['error'] }, na: { ...na, hover: 'pauses auto-close; no visual change' },
    render: (v, p) => toastStage(p.kinds, v, 'pos-toast'),
    describe: ['react-toastify colored toast: 20px status icon, 0.8rem/500 message, close button and a progress bar; the default frame is the KOT alert (showToast.error from KotAlertListener).', 'Appears top-right for 2 seconds after a KOT error, save or other action.'],
    variants: {
      success: { props: { kinds: ['success'] }, describe: 'showToast.success: green.' },
      warning: { props: { kinds: ['warning'] }, describe: 'showToast.warning: amber.' },
      info: { props: { kinds: ['info'] }, describe: 'showToast.info: blue.' },
      stacked: { props: { kinds: ['error', 'success'] }, describe: 'Two toasts stacked (container limit is 3).' },
    } },
];
