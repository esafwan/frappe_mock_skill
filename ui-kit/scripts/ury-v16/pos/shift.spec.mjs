// POS shift specs: opening screen, closing dialog, checklist gate (1440x900 stages over a bg-black/50 scrim).
// Arabic: fixed UI labels from pos/src/i18n/locales/ar.json. Sample data (names, modes, checklist items) has no Arabic source and is translated by hand.
import { money } from '../lib.mjs';
import { STATE_NA } from '../lib.mjs';
import { openingScreen, closingScreen, gateScreen } from './shift.mjs';

const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-shift.css'];
const base = { width: 1440, height: 900, dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], group: 'pos', static: true };
const na = { hover: STATE_NA.desktop, focus: STATE_NA.desktop, active: STATE_NA.desktop };
const split = (o) => ({ slots: Object.fromEntries(Object.entries(o).map(([k, [en]]) => [k, en])), rtlValues: Object.fromEntries(Object.entries(o).map(([k, [en, ar]]) => [k, ar === undefined ? en : ar])) });
const cur = (n, ar) => [money(n), ar];

/* ---- opening ---- */
const O = {
  title: ['Open POS Session', 'فتح وردية نقطة البيع'], subtitle: ['Start a new POS session to begin taking orders', 'ابدأ جلسة جديدة لنقطة البيع لبدء استقبال الطلبات'],
  l_details: ['Session Details', 'تفاصيل الوردية'], l_company: ['Company', 'الشركة'], l_branch: ['Branch', 'الفرع'], l_restaurant: ['Restaurant', 'المطعم'],
  l_cashier: ['Cashier', 'الكاشير'], l_start: ['Session Start', 'بداية الوردية'], l_profile: ['POS Profile', 'ملف نقطة البيع'],
  company: ['Al Noor Hospitality', 'النور للضيافة'], branch: ['Downtown', 'وسط المدينة'], restaurant: ['Mediterranean Table', 'المائدة المتوسطية'],
  cashier: ['Sara Khan', 'سارة خان'], start: ['21/11/2026, 09:30:00', '٢١‏/١١‏/٢٠٢٦، ٠٩:٣٠:٠٠'], profile: ['Counter 1', 'الكاونتر 1'],
  l_balance: ['Opening Balance', 'رصيد الافتتاح'], l_mode: ['Mode of Payment', 'طريقة الدفع'], l_amount: ['Opening Amount', 'مبلغ الافتتاح'], l_total: ['Total Opening Balance', 'إجمالي رصيد الافتتاح'],
  help: ["Opening Balance is the starting cash/payment amount you're declaring for this shift. It's used to reconcile against sales when you close out.", 'رصيد الافتتاح هو المبلغ النقدي/الدفوعات المبدئية التي تبدأ بها الوردية وتُستخدم للمطابقة عند الإغلاق.'],
  mode1: ['Cash', 'نقدي'], mode2: ['Card', 'بطاقة'], mode3: ['Online Payment', 'دفع إلكتروني'],
  amt1: ['500', '500'], amt2: ['0', '0'], amt3: ['0', '0'],
  total_open: cur(500), total_zero: cur(0),
  btn_open: ['Open POS Session', 'فتح وردية نقطة البيع'], btn_opening: ['Opening...', 'جاري الفتح...'], btn_confirm: ['Confirm & Open', 'تأكيد وفتح'],
  btn_retry: ['Retry', 'إعادة المحاولة'], btn_back: ['Back to Dashboard', 'العودة إلى لوحة التحكم'],
  msg_no_profiles: ['No POS Profile is available for your user in this branch. Contact your manager.', 'لا يوجد ملف نقطة بيع متاح للمستخدم في هذا الفرع. تواصل مع المسؤول.'],
  msg_no_permission: ["You don't have permission to open a session. Contact your manager.", 'ليس لديك صلاحية لفتح وردية. تواصل مع المسؤول.'],
  msg_daily_close: ["Yesterday's session was never closed. Contact your manager to close it before opening today.", 'وردية الأمس لم تُغلق بعد. يرجى إغلاقها أولاً قبل فتح وردية اليوم.'],
  msg_main_cashier: ["The main cashier hasn't opened the register yet. Please wait or contact your main cashier.", 'لم يقم الكاشير الرئيسي بفتح الصندوق بعد. يرجى الانتظار أو مراجعة الكاشير الرئيسي.'],
  msg_error: ['Failed to open POS session. Please try again.', 'فشل فتح وردية نقطة البيع. يرجى المحاولة مرة أخرى.'],
  zero_warning: ['You\'re opening with AED 0.00 across all payment modes. Tap "Confirm & Open" again to continue anyway.', 'أنت تفتح الجلسة برصيد AED 0.00 في جميع طرق الدفع. اضغط "تأكيد وفتح" مرة أخرى للمتابعة.'],
};
const oc = split(O);
const openSpec = {
  ...base, id: 'pos-opening-screen', name: 'POS opening screen', ...oc,
  props: {}, render: (v, p) => openingScreen(v, p, 'pos-opening-screen'),
  describe: ['Full-screen POS Opening modal (POSOpeningScreen): header, session detail badges, opening balance table with currency inputs and total, and the Open / Retry / Back actions on a bg-black/50 scrim.', 'First screen a cashier sees when starting a shift, before the register is usable.'],
  na: { disabled: 'shown as the blocked variants where the action buttons and inputs are disabled', loading: 'the submitting variant covers the loading state', empty: 'amounts left at zero are the zero-balance variant' },
  naDefault: STATE_NA.desktop,
  variants: {
    'error-no-profiles': { props: { alert: 'no_profiles' }, describe: 'No POS Profile for the user: red alert, inputs and Open button disabled.' },
    'error-no-permission': { props: { alert: 'no_permission' }, describe: 'User cannot create or submit an opening entry: red alert with lock icon.' },
    'warning-previous-day': { props: { alert: 'daily_close' }, describe: 'Previous day not closed: orange alert, Open button disabled.' },
    'warning-main-cashier': { props: { alert: 'main_cashier' }, describe: 'Multi-cashier: main cashier has not opened yet, orange alert.' },
    'zero-balance-confirm': { props: { zero: true }, describe: 'All amounts zero after the first press: orange warning and the button reads Confirm & Open.' },
    submitting: { props: { submitting: true }, describe: 'Opening in progress: spinner icon and Opening... label, actions disabled.' },
    'submit-error': { props: { error: true }, describe: 'Server error shown in a red box above the actions.' },
    'profile-select': { props: { profileSelect: true }, describe: 'More than one allowed profile: POS Profile select replaces the profile badge.' },
  },
  describeStates: undefined,
};

/* ---- closing ---- */
const C = {
  title: ['Close POS', 'إغلاق نقطة البيع'], desc: ['Review sales for your session and enter the actual closing amounts.', 'راجع مبيعات ورديتك وأدخل المبالغ الفعلية للإغلاق.'],
  l_grand: ['Grand Total', 'الإجمالي الكلي'], l_net: ['Net Total', 'الصافي'], l_qty: ['Total Quantity', 'إجمالي الكمية'], l_invoices: ['Total Invoices', 'إجمالي الفواتير'],
  grand: cur(1847.5), net: cur(1759.52), qty: ['86', '86'], invoices: ['42', '42'],
  h_mode: ['Payment Mode', 'طريقة الدفع'], h_opening: ['Opening', 'الافتتاح'], h_expected: ['Expected', 'المتوقع'], h_closing: ['Closing', 'الإغلاق'], h_diff: ['Difference', 'الفرق'],
  row1: ['Cash', 'نقدي'], row2: ['Card', 'بطاقة'], row3: ['Online Payment', 'دفع إلكتروني'],
  open1: cur(500), open2: cur(0), open3: cur(0), exp1: cur(1150), exp2: cur(520.5), exp3: cur(177),
  cl1: cur(1150), cl2: cur(508), diff1: cur(0), diff2: cur(-12.5), diff3: cur(-177),
  warn_zero: ['One or more payment modes were left at 0 despite having activity today. Double-check before submitting.', 'تم ترك طريقة دفع واحدة أو أكثر عند 0 رغم وجود حركة اليوم. يرجى التحقق قبل الإرسال.'],
  no_invoices: ['No invoices were found for this period.', 'لا توجد فواتير لهذه الفترة.'],
  btn_cancel: ['Cancel', 'إلغاء'], btn_close: ['Close POS', 'إغلاق الوردية'], btn_submitting: ['Closing POS...', 'جاري إغلاق نقطة البيع...'],
  msg_fail: ['Failed to close POS', 'فشل إغلاق الوردية'],
  confirm_title: ['Confirm POS Close', 'تأكيد إغلاق نقطة البيع'], confirm_msg: ['This will submit the closing entry and cannot be undone. Are you sure you want to continue?', 'سيؤدي هذا إلى ترحيل إدخال الإغلاق ولا يمكن التراجع عنه. هل أنت متأكد من المتابعة؟'],
  confirm_yes: ['Yes, Close POS', 'نعم، أغلق الوردية'], confirm_back: ['Go Back', 'رجوع'],
};
const cc = split(C);
const closeSpec = {
  ...base, id: 'pos-closing-dialog', name: 'POS closing dialog', ...cc,
  props: {}, render: (v, p) => closingScreen(v, p, 'pos-closing-dialog'),
  describe: ['POS Closing dialog (POSClosingDialog + ClosingPaymentTable): summary cards, per-payment-mode opening / expected / closing / difference table, amber warning and Cancel / Close POS footer, with the confirm modal as a variant.', 'When the cashier ends a shift and counts each payment mode.'],
  na: { disabled: 'shown in the empty variant (Close POS disabled)', loading: 'the submitting variant shows the closing label', error: 'shown as the submit-error variant', empty: 'shown as the empty variant' },
  naDefault: STATE_NA.desktop,
  variants: {
    confirm: { props: { confirm: true }, describe: 'Confirm modal (z-70, max-w 384): Go Back / Yes, Close POS over the dialog.' },
    'confirm-submitting': { props: { confirm: true, submitting: true }, describe: 'Confirm modal while the closing entry is submitting.' },
    'submit-error': { props: { error: true }, describe: 'Red submit error line above the footer.' },
    'masked-amounts': { props: { masked: true }, describe: 'Amounts masked (shouldMaskAmounts): grand/net totals, expected and difference show an em dash.' },
    'no-invoices': { props: { empty: true }, describe: 'No invoices for the period: empty message and the Close POS button disabled.' },
  },
};

/* ---- checklist gate ---- */
const G = {
  gate_title: ['Closing Checklist', 'قائمة التحقق عند الإغلاق'], gate_desc: ['Please complete the checklist below before you continue.', 'يرجى إكمال قائمة التحقق أدناه قبل المتابعة.'],
  item1: ['Cash drawer counted and sealed', 'تم عد درج النقد وإغلاقه'], item2: ['Kitchen equipment switched off', 'تم إطفاء معدات المطبخ'], item3: ['Tables cleaned and reset', 'تم تنظيف الطاولات وإعادة ترتيبها'], item4: ['Printer paper stock checked', 'تم فحص مخزون ورق الطابعة'],
  pass: ['PASS', 'PASS'], fail: ['FAIL', 'FAIL'],
  ph_remarks: ['Remarks', 'ملاحظات'], ph_fail: ['Explain the failure (required)', 'اشرح سبب الفشل (مطلوب)'], fail_required: ['Remarks are required for failed items.', 'الملاحظات مطلوبة للعناصر الفاشلة.'],
  rem2: ['Gas line left on, manager informed', 'خط الغاز تُرك مفتوحاً، تم إبلاغ المدير'], rem3: ['Done before 11 PM', 'تم قبل الساعة 11 مساءً'],
  btn_submit: ['Submit Checklist', 'إرسال قائمة التحقق'], btn_submitting: ['Submitting...', 'جاري الإرسال...'], btn_recheck: ['Recheck', 'إعادة التحقق'], btn_start: ['Start Checklist', 'بدء قائمة التحقق'],
  blocked_heading: ['Closing Checklist Required', 'مطلوب: قائمة التحقق عند الإغلاق'],
  blocked_msg: ['Cashier has not completed the Closing Checklist yet. Please ask the Cashier to complete it before continuing.', 'لم يكمل الكاشير قائمة التحقق عند الإغلاق بعد. يُرجى مطالبة الكاشير بإكماله قبل المتابعة.'],
  msg_incomplete: ['Every item must be marked PASS or FAIL before this checklist can be completed.', 'يجب تحديد PASS أو FAIL لكل عنصر قبل إكمال القائمة.'],
  skip_hint: ['The POS close was already submitted. You can finish this checklist later.', 'تم إرسال إغلاق نقطة البيع بالفعل. يمكنك إكمال قائمة التحقق لاحقاً.'],
  skip: ['Skip for now', 'تخطي الآن'],
};
const gc = split(G);
const openVals = { gate_title: 'Opening Checklist', item1: 'Cash drawer counted', item2: 'Card terminal connected', item3: 'Printer paper loaded', item4: 'Floor cleaned and tables set', blocked_heading: 'Opening Checklist Required', blocked_msg: 'Cashier has not completed the Opening Checklist yet. Please ask the Cashier to complete it before continuing.' };
const openAr = { gate_title: 'قائمة التحقق عند الفتح', item1: 'تم عد درج النقد', item2: 'تم توصيل جهاز البطاقات', item3: 'تم تركيب ورق الطابعة', item4: 'تم تنظيف الأرضية وتجهيز الطاولات', blocked_heading: 'مطلوب: قائمة التحقق عند الفتح', blocked_msg: 'لم يكمل الكاشير قائمة التحقق عند الفتح بعد. يُرجى مطالبة الكاشير بإكماله قبل المتابعة.' };
const mixed = [{ st: 'P', rem: null, req: true }, { st: 'F', rem: null, req: true }, { st: null, rem: null, req: true }, { st: null, rem: null, req: false }];
const done = [{ st: 'P', rem: null, req: true }, { st: 'F', rem: 'rem2', req: true }, { st: 'P', rem: 'rem3', req: true }, { st: 'P', rem: null, req: false }];
const gateSpec = {
  ...base, id: 'pos-checklist-gate', name: 'POS checklist gate', slots: gc.slots, rtlValues: gc.rtlValues,
  props: { kind: 'closing', items: mixed },
  render: (v, p) => gateScreen(v, p, 'pos-checklist-gate'),
  describe: ['Non-dismissible Checklist gate (ChecklistGateDialog): PASS / FAIL radios per item with remarks, required remarks on FAIL, and a Submit Checklist button; blocked and start states.', 'Blocks the POS until the Opening or Closing checklist is complete; also shown after a POS close with a Skip bar.'],
  na: { disabled: 'Submit Checklist is shown disabled in the default variant until all mandatory items are answered', error: 'shown as the submit-error variant', loading: 'the submitting variant', empty: 'no items auto-submits and is not rendered' },
  naDefault: STATE_NA.desktop,
  variants: {
    closing: { props: { items: done }, describe: 'Closing checklist fully answered: Submit enabled.' },
    opening: { props: { items: done }, values: openVals, rtlValues: openAr, describe: 'Opening checklist title and items, all answered.' },
    'opening-incomplete': { props: { items: mixed }, values: openVals, describe: 'Opening checklist with a FAIL missing its remark (error text) and unanswered items; Submit disabled.' },
    blocked: { props: { state: 'blocked' }, describe: 'Predecessor role has not finished: "<Checklist> Required" with the Recheck button.' },
    'blocked-opening': { props: { state: 'blocked' }, values: openVals, describe: 'Blocked state for the Opening checklist.' },
    start: { props: { state: 'start', items: done }, describe: 'Eligible user before starting: Start Checklist button.' },
    submitting: { props: { items: done, submitting: true }, describe: 'Submitting label with button dimmed.' },
    'submit-error': { props: { items: done, submitError: true }, describe: 'Incomplete submission error text above the button.' },
    'with-skip-bar': { props: { items: done, skip: true }, describe: 'Closing checklist after POS close: fixed bottom-6 bar with Skip for now (z-60).' },
  },
};
gateSpec.props = { kind: 'closing', items: mixed };

export const specs = [openSpec, closeSpec, gateSpec];
