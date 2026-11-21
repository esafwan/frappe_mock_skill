// URY v16 admin masters + setup specs (T22): table master list (+ SideDrawer), branch master form, Sales Plan page, setup wizard (/setup-wizard/0 and /1), printer configuration.
// Sources: frontend/src/pages/Dashboard/{TablePage,BranchPage,SalesPlanPage,PrinterConfigPage}.tsx, pages/Setup/{SetupPage,ConfigurePage}.tsx, components/layout/{SideDrawer,PageToolbar}.tsx,
// components/setup/*, components/workflow/WorkflowStatusStepper.tsx (SalesPlanPage draws its own LifecycleStepper, which is what is mocked), data/schemas/{table,branch}.json, data/forms/setup.json.
// Markup helpers live in this file (T22 owns no other script). Admin screens sit inside adminLayout (shell.mjs); the setup wizard has no admin shell (WizardLayout).
// Arabic: fixed UI labels come from ury/translations/ar.csv. Hand-translated (no ar.csv entry): schema-only titles (Room Area, Number of Seats, Advanced Layout Position, X/Y Position, Width/Height), the
// setup form labels, "Edit", "Lock for Production", "Return to Draft", "Network Printers", "Plan", "Import", "Export" row copy and every sample value (names, items, units, dates).
import { ic, STATE_NA, screen } from '../lib.mjs';
import { adminLayout, shellSlots, shellRtl } from './shell.mjs';

const LOGO = 'data:image/jpeg;base64,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';
const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/admin-shell.css', 'ury-v16/components/admin-masters.css'];
const base = { group: 'ury-admin', static: true, width: 1440, height: 900, dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };

// lucide-react 0.525 paths (ISC) for icons beyond ../icons.mjs
const EXTRA = {
  ArrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  Save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  Edit2: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
  LayoutTemplate: '<rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/>',
  ChevronUp: '<path d="m18 15-6-6-6 6"/>',
  Building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  Send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
  History: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  Download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  Upload: '<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',
  CheckCircle2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  Info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  Map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  CreditCard: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  ListFilter: '<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>',
  Lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  Grid: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',
};
const I = (n, s = 16, c = '') => ic(n, s, c, EXTRA);
const T = (k) => `{{${k}}}`;
const u = (id) => `data-ui="${id}"`;

// ---------- copy: key -> [English, Arabic] ----------
const D = {
  // table master (schema titles from data/schemas/table.json)
  search: ['Search', 'البحث'], edit_layout: ['Edit Layout', 'تعديل التخطيط'], add_table: ['Add Table', 'إضافة طاولة'],
  f_name: ['Table Name', 'اسم الطاولة'], f_seats: ['Number of Seats', 'عدد المقاعد'], f_room: ['Room Area', 'منطقة القاعة'], f_branch: ['Branch', 'فرع'],
  f_status: ['Status', 'الحالة'], f_shape: ['Table Shape', 'شكل الطاولة'], f_layout: ['Advanced Layout Position', 'موضع التخطيط المتقدم'],
  f_x: ['X Position', 'الموضع س'], f_y: ['Y Position', 'الموضع ص'], f_w: ['Width (px)', 'العرض (بكسل)'], f_h: ['Height (px)', 'الارتفاع (بكسل)'],
  c_actions: ['Actions', 'الإجراءات'], ph_name: ['e.g. T-01', 'مثال: T-01'],
  t1: ['T-01', 'T-01'], t2: ['T-02', 'T-02'], t3: ['T-03', 'T-03'], t4: ['T-04', 'T-04'], t5: ['T-05', 'T-05'], t6: ['T-06', 'T-06'],
  rm_main: ['Main Hall', 'القاعة الرئيسية'], rm_terr: ['Terrace', 'التراس'], rm_vip: ['VIP Lounge', 'صالة كبار الزوار'], rm_roof: ['Rooftop Garden', 'حديقة السطح'], rm_bar: ['Bar Counter', 'كاونتر البار'],
  sh_sq: ['Square', 'مربع'], sh_re: ['Rectangle', 'مستطيل'], sh_ci: ['Circle', 'دائرة'],
  st_av: ['Available', 'متاح'], st_oc: ['Occupied', 'مشغولة'], st_rs: ['Reserved', 'محجوزة'], st_cl: ['Cleaning', 'قيد التنظيف'],
  br_main: ['Main Branch', 'Main Branch'],
  n0: ['0', '0'], n2: ['2', '2'], n4: ['4', '4'], n6: ['6', '6'], n8: ['8', '8'], n80: ['80', '80'], n120: ['120', '120'], n240: ['240', '240'], n360: ['360', '360'],
  seats_w: ['Seats', 'المقاعد'], branch_c: ['Branch:', 'الفرع:'],
  dr_add: ['Add Dining Table', 'إضافة طاولة طعام'], dr_edit: ['Edit Dining Table', 'تعديل طاولة طعام'], cancel: ['Cancel', 'إلغاء'], save_table: ['Save Table', 'حفظ الطاولة'], save_changes: ['Save Changes', 'حفظ التغييرات'],
  e_title: ['No Dining Tables Configured', 'لا توجد طاولات طعام مهيأة'], e_text: ['Add dining tables to configure your restaurant layout.', 'أضف طاولات الطعام لتهيئة تخطيط مطعمك.'],
  // branch master (schema titles from data/schemas/branch.json)
  back: ['Back', 'خلف'], save: ['Save', 'حفظ'], edit: ['Edit', 'تعديل'], addr_c: ['Address:', 'العنوان:'], addr_v: ['Marina Walk, Dubai', 'Marina Walk, Dubai'],
  s_info: ['Branch Info', 'معلومات الفرع'], s_fiscal: ['Fiscal & Operational Identification', 'التعريف المالي والتشغيلي'],
  b_name: ['Branch Name', 'اسم الفرع'], b_addr: ['Address', 'العنوان'], b_inv: ['Invoice Series Prefix', 'بادئة سلسلة الفواتير'], b_agg: ['Aggregator Series Prefix', 'بادئة تسلسل منصة التجميع'],
  b_tax: ['Tax ID', 'الرقم الضريبي'], b_taxt: ['Default Tax Template', 'قالب الضريبة الافتراضي'], b_menu: ['Default Menu (Active Menu)', 'القائمة الافتراضية (القائمة النشطة)'], b_rwm: ['Room Wise Menu', 'قائمة الطعام حسب القاعة'],
  v_inv: ['INV-MAIN-', 'INV-MAIN-'], v_agg: ['AGG-MAIN-', 'AGG-MAIN-'], v_tax: ['100234567890003', '100234567890003'], v_taxt: ['UAE VAT 5% - BLH', 'ضريبة القيمة المضافة 5% - BLH'], v_menu: ['Marina Dinner Menu', 'Marina Dinner Menu'],
  // sales plan
  sp_desc: ["We've suggested quantities based on similar days. Adjust anything you expect to be different, then submit the plan for approval.", 'اقترحنا كميات بناءً على أيام مشابهة. عدّل ما تتوقع أن يختلف، ثم ارفع الخطة للاعتماد.'],
  sp_date: ['21-11-2026', '21-11-2026'], sp_hard: ['Hard', 'صارم'], sp_save_draft: ['Save Draft', 'حفظ كمسودة'], sp_submit_rev: ['Submit for Review', 'إرسال للمراجعة'],
  sp_submit_apr: ['Submit for Approval', 'رفع للاعتماد'], sp_approve: ['Approve', 'اعتماد'], sp_lock: ['Lock for Production', 'قفل للإنتاج'], sp_return: ['Return to Draft', 'إعادة إلى مسودة'],
  sp_cancel: ['Cancel', 'إلغاء'], sp_mgr: ['Only managers can approve this plan.', 'يمكن للمدراء فقط اعتماد هذه الخطة.'],
  lc_draft: ['Draft', 'مسودة'], lc_review: ['Review', 'مراجعة'], lc_approval: ['Approval', 'الاعتماد'], lc_prod: ['Ready for Production', 'جاهز للإنتاج'], lc_cancelled: ['Superseded/Cancelled', 'مستبدلة/ملغاة'],
  sum_draft: ['Currently: Draft · Next: Submit for Review', 'الحالة: مسودة · التالي: إرسال للمراجعة'], sum_prop: ['Currently: Review · Next: Submit for Approval', 'الحالة: مراجعة · التالي: رفع للاعتماد'],
  sum_sub: ['Currently: Review · Next: Approve (manager)', 'الحالة: مراجعة · التالي: اعتماد (مدير)'], sum_appr: ['Currently: Approval · Next: Lock for Production', 'الحالة: اعتماد · التالي: قفل للإنتاج'],
  sum_lock: ['Currently: Ready for Production · This plan is locked for production.', 'الحالة: جاهز للإنتاج · هذه الخطة مقفلة للإنتاج.'],
  sum_canc: ['Currently: Superseded/Cancelled · This plan has been superseded or cancelled.', 'الحالة: مستبدلة/ملغاة · تم استبدال هذه الخطة أو إلغاؤها.'],
  k_planned: ['Planned Qty', 'الكمية المخططة'], k_hist: ['History Avg', 'متوسط السجل'], k_items: ['Items', 'الاصناف'], k_blocked: ['Blocked', 'محظور'],
  k_v1: ['186', '186'], k_v2: ['174', '174'], k_v3: ['12', '12'], k_v4: ['2', '2'],
  sp_search: ['Search item, department, or production unit', 'ابحث عن صنف أو قسم أو وحدة إنتاج'], needs_att: ['Needs Attention', 'يحتاج انتباهاً'],
  g_k_n: ['4 items', '4 أصناف'], g_k_p: ['86 planned', '86 مخطط'], g_b_n: ['3 items', '3 أصناف'], g_b_p: ['54 planned', '54 مخطط'], g_c_n: ['5 items', '5 أصناف'], g_c_p: ['46 planned', '46 مخطط'],
  filter_k: ['Filter Kitchen items', 'تصفية أصناف المطبخ'], x_export: ['Export', 'تصدير'], x_import: ['Import', 'استيراد'], x_zero: ['Set all to 0', 'ضبط الكل على 0'],
  h_item: ['Item', 'الصنف'], h_hist: ['History Insight', 'رؤية من السجل'], h_unit: ['Production Unit', 'وحدة الإنتاج'], h_plan: ['Plan', 'الخطة'], h_var: ['Variance', 'الفرق'],
  i1: ['Chicken Biryani', 'Chicken Biryani'], i2: ['Lamb Shank', 'Lamb Shank'], i3: ['Grilled Hammour', 'Grilled Hammour'], i4: ['Hummus Plate', 'Hummus Plate'],
  c1: ['ITM-0101', 'ITM-0101'], c2: ['ITM-0102', 'ITM-0102'], c3: ['ITM-0103', 'ITM-0103'], c4: ['ITM-0104', 'ITM-0104'],
  hi1: ['Last 4 comparable days avg 18 Nos', 'آخر 4 أيام مماثلة بمتوسط 18 وحدة'], hi2: ['Last 4 comparable days avg 12 Nos', 'آخر 4 أيام مماثلة بمتوسط 12 وحدة'],
  hi3: ['Last 4 comparable days avg 9 Nos', 'آخر 4 أيام مماثلة بمتوسط 9 وحدات'], hi4: ['Last 4 comparable days avg 25 Nos', 'آخر 4 أيام مماثلة بمتوسط 25 وحدة'],
  un1: ['Hot Line', 'الخط الساخن'], un2: ['Grill Station', 'محطة الشواء'], un3: ['Cold Mezze', 'المقبلات الباردة'],
  q1: ['20', '20'], q2: ['10', '10'], q3: ['9', '9'], q4: ['28', '28'], v1: ['+2', '+2'], v2: ['-2', '-2'], v3: ['0', '0'], v4: ['+3', '+3'],
  att_1: ['Needs Attention', 'يحتاج انتباهاً'],
  // setup wizard
  w_title: ["Let's get your restaurant ready", 'لنجهّز مطعمك'], w_setup: ['Setup', 'الإعداد'], w_configure: ['Configure', 'ضبط'], w_logo: ['URY Logo', 'شعار URY'],
  w_company: ['Company Name', 'اسم الشركة'], w_abbr: ['Company Abbreviation', 'اختصار الشركة'], w_lang: ['Your Language', 'لغتك'], w_country: ['Your Country', 'بلدك'],
  w_tz: ['Timezone', 'المنطقة الزمنية'], w_cur: ['Currency', 'العملة'], w_chart: ['Chart of Accounts', 'دليل الحسابات'], w_fy: ['Financial Year Begins On', 'تبدأ السنة المالية في'],
  w_abbr_d: ['Used as a short prefix for your invoice numbers. Auto-filled from your company name — edit if you\'d like something different.', 'تُستخدم كبادئة قصيرة لأرقام فواتيرك. تُملأ تلقائياً من اسم شركتك — عدّلها إن أردت شيئاً مختلفاً.'],
  w_chart_d: ['A template for how your income and expenses get categorized. We\'ve picked one for your country — you usually don\'t need to change this.', 'قالب لكيفية تصنيف إيراداتك ومصروفاتك. اخترنا واحداً لبلدك — لا تحتاج عادةً إلى تغييره.'],
  w_fy_d: ['When your financial year starts. Most businesses use the default for their country — change this only if your accountant asks you to.', 'موعد بدء سنتك المالية. تستخدم معظم الأعمال الافتراضي لبلدها — غيّره فقط إذا طلب منك المحاسب ذلك.'],
  w_v_company: ['Bay Leaf Hospitality', 'Bay Leaf Hospitality'], w_v_abbr: ['BLH', 'BLH'], w_v_lang: ['English', 'English'], w_v_country: ['United Arab Emirates', 'الإمارات العربية المتحدة'],
  w_v_tz: ['Asia/Dubai', 'Asia/Dubai'], w_v_cur: ['AED', 'AED'], w_v_chart: ['United Arab Emirates - Chart of Accounts', 'الإمارات العربية المتحدة - دليل الحسابات'], w_v_fy: ['01-01-2026', '01-01-2026'],
  w_install: ['Installation Type', 'نوع التثبيت'], w_min: ['Minimal Installation', 'تثبيت أدنى'], w_adv: ['Advanced Installation', 'تثبيت متقدم'],
  w_demo: ['Set up with demo data', 'الإعداد ببيانات تجريبية'], w_demo_d: ['Adds a sample branch, rooms, tables, menu, and POS you can change or delete later.', 'يضيف فرعاً وقاعات وطاولات وقائمة ونقطة بيع نموذجية يمكنك تغييرها أو حذفها لاحقاً.'],
  w_continue: ['Continue', 'متابعة'], w_prev: ['Previous', 'السابق'], w_next: ['Next', 'التالي'], w_later: ['the data can be changed later', 'يمكن تغيير البيانات لاحقاً'], w_defaults: ['Finish with defaults', 'إنهاء بالإعدادات الافتراضية'],
  w_conf: ['Configuration', 'الإعدادات'], w_n_branch: ['Branch', 'فرع'], w_n_rooms: ['Rooms', 'القاعات'], w_n_tables: ['Tables', 'الطاولات'], w_n_menu: ['Menu', 'القائمة'], w_n_pay: ['Payments', 'المدفوعات'], w_n_user: ['User', 'المستخدم'],
  w_s_title: ['Branch Details', 'تفاصيل الفرع'], w_s_desc: ['Set up your main branch name, invoice numbering, and tax details.', 'اضبط اسم فرعك الرئيسي وترقيم الفواتير والتفاصيل الضريبية.'],
  w_bname: ['Branch Name', 'اسم الفرع'], w_btax: ['Tax ID', 'الرقم الضريبي'], w_binv: ['Invoice Prefix', 'بادئة الفاتورة'], w_bagg: ['Aggregator Prefix', 'بادئة مجمّع الطلبات'],
  w_bname_v: ['Marina Branch', 'Marina Branch'], w_ph_tax: ['Optional', 'اختياري'], w_ph_agg: ['AGG-', 'AGG-'], w_binv_v: ['INV-', 'INV-'],
  w_tax_d: ['Optional, add this now or later.', 'اختياري، أضفه الآن أو لاحقاً.'], w_inv_d: ['Shown at the start of every bill number, like INV-0001.', 'يظهر في بداية كل رقم فاتورة، مثل INV-0001.'],
  w_agg_sw: ['Takes orders through food-delivery apps', 'يستقبل طلبات عبر تطبيقات توصيل الطعام'], w_agg_d: ['A separate bill number series for delivery app orders.', 'سلسلة أرقام فواتير منفصلة لطلبات تطبيقات التوصيل.'],
  w_agg_v: ['AGG-', 'AGG-'],
  // printer configuration
  pc_title: ['Printer Configuration', 'إعدادات الطابعة'], pc_desc: ['Manage network printers and printer assignments across POS Profiles, Production Units, and Rooms.', 'إدارة الطابعات الشبكية وتعيينات الطابعات عبر ملفات نقطة البيع ووحدات الإنتاج والقاعات.'],
  pc_save: ['Save Changes', 'حفظ التغييرات'], pc_net: ['Network Printers', 'الطابعات الشبكية'], pc_net_d: ['Configured CUPS and network printer endpoints.', 'نقاط اتصال CUPS والطابعات الشبكية المهيأة.'],
  pc_add_np: ['Add Network Printer', 'إضافة طابعة شبكية'], pc_np_name: ['Printer Name / ID', 'اسم الطابعة / المعرّف'], pc_np_ip: ['Server IP', 'عنوان IP للخادم'], pc_np_port: ['Port', 'المنفذ'],
  pc_np_dev: ['Printer Device Name', 'اسم جهاز الطابعة'], pc_np_none: ['No network printers configured.', 'لا توجد طابعات شبكية مهيأة.'],
  np1: ['Kitchen Printer', 'طابعة المطبخ'], np2: ['Bar Printer', 'طابعة البار'], ip1: ['localhost', 'localhost'], ip2: ['localhost', 'localhost'], pt1: ['631', '631'], pt2: ['9100', '9100'], dv1: ['EPSON_TM-T88VI', 'EPSON_TM-T88VI'], dv2: ['STAR_TSP100', 'STAR_TSP100'],
  pc_unit_t: ['URY Production Unit Printer Settings', 'إعدادات طابعة وحدة الإنتاج'], pc_unit_d: ['Configure KOT and order routing printers for kitchen and bar production units.', 'اضبط طابعات أوامر المطبخ وتوجيه الطلبات لوحدات إنتاج المطبخ والبار.'],
  pc_room_t: ['URY Room Printer Settings', 'إعدادات طابعة القاعة'], pc_room_d: ['Configure dining area, hall, and room printer routing.', 'اضبط توجيه الطابعات لمناطق الطعام والصالات والقاعات.'],
  pc_pos_t: ['POS Profile Printer Settings', 'إعدادات طابعة الملف الشخصي لنقطة البيع'], pc_pos_a: ['Configure invoice, receipt, and QZ printing for POS profiles.', 'اضبط طباعة الفواتير والإيصالات وطباعة QZ لملفات نقطة البيع.'],
  l_unit: ['Production Unit', 'وحدة الإنتاج'], l_room: ['Room', 'قاعة'], l_pos: ['POS Profile', 'الملف الشخصي لنقطة البيع'],
  v_unit: ['Main Kitchen', 'المطبخ الرئيسي'], v_dept: ['Kitchen', 'المطبخ'], v_room: ['Main Hall', 'القاعة الرئيسية'], v_pos: ['Marina Counter', 'Marina Counter'],
  pc_printers: ['Printers', 'الطابعات'], pc_add_row: ['Add Row', 'إضافة صف'], pc_bill: ['Bill', 'الفاتورة'], pc_kot: ['KOT Print', 'طباعة أمر المطبخ'], pc_waiter: ['Waiter Print', 'طباعة النادل'], pc_printer: ['Printer', 'الطابعة'],
  pc_std: ['Standard Print Settings', 'إعدادات الطباعة القياسية'], pc_pf: ['Print Format', 'تنسيق الطباعة'], pc_lh: ['Letter Head', 'ترويسة الطباعة'], pc_tc: ['Terms and Conditions', 'الشروط والأحكام'], pc_ph: ['Print Heading', 'عنوان الطباعة'],
  v_pf: ['POS Invoice Standard', 'فاتورة نقطة البيع القياسية'], v_lh: ['Bay Leaf Letterhead', 'Bay Leaf Letterhead'], v_tc: ['Standard Terms', 'الشروط القياسية'], v_ph: ['Tax Invoice', 'فاتورة ضريبية'],
  pc_hw: ['Hardware / QZ Settings', 'إعدادات الأجهزة / QZ'], pc_qz: ['QZ Print', 'طباعة QZ'], pc_qz_d: ['Print through a local QZ Tray client instead of network printers.', 'الطباعة عبر عميل QZ Tray محلي بدلاً من الطابعات الشبكية.'],
  pc_qzh: ['QZ Host', 'مضيف QZ'], pc_reprint: ['Enable KOT Reprint', 'تفعيل إعادة طباعة أمر المطبخ'], pc_reprint_d: ['Allow reprinting KOTs for table and parcel orders.', 'السماح بإعادة طباعة أوامر المطبخ لطلبات الطاولات والطلبات الخارجية.'],
  pc_rkf: ['Reprint KOT Format', 'تنسيق إعادة طباعة أمر المطبخ'], pc_top: ['Table Order Printer', 'طابعة طلبات الطاولات'], pc_pop: ['Parcel Order Printer', 'طابعة الطلبات الخارجية'],
  v_kf: ['KOT Standard', 'أمر المطبخ القياسي'], pr1: ['Kitchen Printer', 'طابعة المطبخ'], pr2: ['Bar Printer', 'طابعة البار'], v_host: ['localhost', 'localhost'],
  pc_dlg_np: ['Add Network Printer', 'إضافة طابعة شبكية'], pc_dlg_add: ['Add Printer', 'إضافة طابعة'], ph_np: ['e.g. Kitchen Printer', 'مثال: طابعة المطبخ'], ph_dev: ['e.g. EPSON_TM-T88VI', 'مثال: EPSON_TM-T88VI'],
  pc_del_t: ['Delete Network Printer', 'حذف طابعة شبكية'], pc_del_a: ['Are you sure you want to delete', 'هل أنت متأكد أنك تريد حذف'], pc_del_b: ['? Printer assignments referencing it will need to be reconfigured.', '؟ ستحتاج تعيينات الطابعات التي تشير إليها إلى إعادة ضبط.'],
  pc_delete: ['Delete', 'حذف'],
};
const mine = (html) => [...new Set([...String(html).matchAll(/\{\{([a-z0-9_]+)\}\}/g)].map((m) => m[1]))].filter((k) => k in D);
const slotsOf = (html) => ({ ...shellSlots(html), ...Object.fromEntries(mine(html).map((k) => [k, D[k][0]])) });
const rtlOf = (html) => ({ ...shellRtl(html), ...Object.fromEntries(mine(html).map((k) => [k, D[k][1]])) });
const all = (render, variants) => [render({}, {}), ...Object.values(variants).map((v) => render({}, v.props || {}))].join('');

// ---------- atoms ----------
const star = (cls = '') => `<span class="uam-req${cls}">*</span>`;
const lbl = (k, req, cls = '') => `<label class="uam-lbl${cls}">${T(k)}${req ? ' ' + star() : ''}</label>`;
const inp = (k, o = {}) => `<div class="uam-in${o.lg ? ' uam-in--lg' : ''}${o.cmp ? ' uam-in--cmp' : ''}${o.focus ? ' is-focus' : ''}${o.off ? ' is-off' : ''}${o.search ? ' uam-in--s' : ''}"${o.ui ? ' ' + u(o.ui) : ''}>${o.search ? I('Search', 16, 'uam-in__s') : ''}<span class="uam-in__t${o.ph ? ' uam-in__ph' : ''}">${T(k)}</span></div>`;
const sel = (k, o = {}) => `<div class="uam-in uam-in--sel${o.lg ? ' uam-in--lg' : ''}${o.off ? ' is-off' : ''}"${o.ui ? ' ' + u(o.ui) : ''}><span class="uam-in__t">${T(k)}</span><span class="uam-in__c">${I('ChevronDown', 16)}</span></div>`;
const sw = (on, off) => `<span class="uam-sw${on ? ' is-on' : ''}${off ? ' is-off' : ''}" role="switch" aria-checked="${!!on}"><span class="uam-sw__t"></span></span>`;
const btn = (cls, inner, o = '') => `<button type="button" class="u-btn ${cls}"${o}>${inner}</button>`;

// =====================================================================================================
// 1. Table master list (TablePage + SideDrawer), labels from data/schemas/table.json
// =====================================================================================================
const TABLES = [['t1', 'rm_main', 'n4', 'sh_sq', 'st_av'], ['t2', 'rm_main', 'n6', 'sh_re', 'st_oc'], ['t3', 'rm_terr', 'n2', 'sh_ci', 'st_av'], ['t4', 'rm_vip', 'n8', 'sh_re', 'st_rs'], ['t5', 'rm_roof', 'n4', 'sh_sq', 'st_cl'], ['t6', 'rm_bar', 'n2', 'sh_ci', 'st_oc']];
const stBadge = (st, sm = true) => `<span class="u-badge u-badge--${st === 'st_oc' ? 'warning' : 'success'}${sm ? ' u-badge--sm' : ''}">${T(st)}</span>`;
const shBadge = (sh) => `<span class="u-badge u-badge--outline uam-badge-o">${T(sh)}</span>`;
const tmToolbar = (p) => `<div class="uam-tb" ${u('ury-admin-screen-master-list.toolbar')}><div class="uam-tb__l"><div class="ua-seg" ${u('ury-admin-screen-master-list.view-toggle')}><span class="ua-seg__b${p.view === 'grid' ? '' : ' is-on'}">${I('List', 16)}</span><span class="ua-seg__b${p.view === 'grid' ? ' is-on' : ''}">${I('Grid', 16)}</span></div>
<div class="uam-search" ${u('ury-admin-screen-master-list.search')}>${p.query ? inp(p.query, { search: 1, focus: 1 }) : inp('search', { search: 1, ph: 1 })}</div></div>
<div class="uam-tb__r">${btn('u-btn--outline uam-fw6', `${I('LayoutTemplate', 16)}<span>${T('edit_layout')}</span>`, ' ' + u('ury-admin-screen-master-list.edit-layout'))}${btn('u-btn--accent uam-fw6', `${I('Plus', 16)}<span>${T('add_table')}</span>`, ' ' + u('ury-admin-screen-master-list.new'))}</div></div>`;
const tmList = (p) => {
  const rows = p.query ? TABLES.filter((r) => r[1] === 'rm_main') : TABLES;
  return `<div class="uam-dt" ${u('ury-admin-screen-master-list.table')}><table><thead><tr><th>${T('f_name')}</th><th>${T('f_room')}</th><th>${T('f_seats')}</th><th>${T('f_shape')}</th><th>${T('f_status')}</th><th class="is-end">${T('c_actions')}</th></tr></thead><tbody>
${rows.map((r, i) => `<tr class="${p.hover === i ? 'is-hover' : ''}" ${u('ury-admin-screen-master-list.row-' + i)}><td>${T(r[0])}</td><td>${T(r[1])}</td><td>${T(r[2])}</td><td>${shBadge(r[3])}</td><td>${stBadge(r[4])}</td><td class="is-end"><button type="button" class="u-btn u-btn--ghost uam-btn-i">${I('Edit2', 16)}</button></td></tr>`).join('')}</tbody></table></div>`;
};
const tmGrid = () => `<div class="uam-grid" ${u('ury-admin-screen-master-list.cards')}>${TABLES.map((r, i) => `<div class="uam-tc" ${u('ury-admin-screen-master-list.card-' + i)}><div><div class="uam-tc__top"><span class="u-badge u-badge--outline uam-badge-o">${I('Square', 12)}${T(r[3])}</span>${stBadge(r[4])}</div><h3 class="uam-tc__n">${T(r[0])}</h3><p class="uam-tc__r">${T(r[1])}</p></div><div class="uam-tc__f"><span>${I('Users', 14)}${T(r[2])} ${T('seats_w')}</span><span>${T('branch_c')} ${T('br_main')}</span></div></div>`).join('')}</div>`;
const tmEmpty = () => `<div class="uam-card uam-empty" ${u('ury-admin-screen-master-list.empty')}><div class="uam-ico uam-ico--c">${I('Grid', 24)}</div><h3>${T('e_title')}</h3><p>${T('e_text')}</p>${btn('u-btn--accent uam-fw6', `${I('Plus', 16)}<span>${T('add_table')}</span>`)}</div>`;
const tmLoading = () => `<div class="uam-load" ${u('ury-admin-screen-master-list.loading')}><div class="uam-spin"></div></div>`;
const tmField = (k, req, inner) => `<div>${lbl(k, req)}${inner}</div>`;
const tmDrawer = (mode) => {
  const edit = mode === 'edit';
  return `<div class="uam-scrim" ${u('ury-admin-screen-master-list.drawer')}><div class="uam-drawer"><div class="uam-drawer__h"><h2 class="uam-drawer__t" ${u('ury-admin-screen-master-list.drawer-title')}>${T(edit ? 'dr_edit' : 'dr_add')}</h2><span class="uam-drawer__x">${I('X', 20)}</span></div>
<div class="uam-drawer__b"><form class="uam-form" ${u('ury-admin-screen-master-list.drawer-form')}><div class="uam-form4">
${tmField('f_name', 1, edit ? inp('t2') : inp('ph_name', { ph: 1 }))}
<div class="uam-g2">${tmField('f_seats', 1, inp(edit ? 'n6' : 'n4'))}${tmField('f_room', 1, sel('rm_main'))}</div>
<div class="uam-g2">${tmField('f_branch', 1, sel('br_main'))}${tmField('f_status', 1, sel(edit ? 'st_oc' : 'st_av'))}</div>
${tmField('f_shape', 1, sel(edit ? 'sh_re' : 'sh_re'))}
<div><h3 class="uam-sub">${T('f_layout')}</h3><div class="uam-g2" ${u('ury-admin-screen-master-list.layout-group')}>${tmField('f_x', 0, inp(edit ? 'n240' : 'n0'))}${tmField('f_y', 0, inp(edit ? 'n120' : 'n0'))}${tmField('f_w', 0, inp('n120'))}${tmField('f_h', 0, inp('n80'))}</div></div>
</div><div class="uam-foot">${btn('u-btn--outline', T('cancel'))}${btn('u-btn--accent', T(edit ? 'save_changes' : 'save_table'))}</div></form></div></div></div>`;
};
const tmRender = (v, p = {}) => {
  const body = p.loading ? tmLoading() : p.empty ? tmEmpty() : p.view === 'grid' ? tmGrid() : tmList(p);
  const main = `<div class="uam-stack" ${u('ury-admin-screen-master-list.page')}>${tmToolbar(p)}${body}</div>`;
  return screen(1440, 900, adminLayout('/table', main) + (p.drawer ? tmDrawer(p.drawer) : ''), 'ury-admin-screen-master-list');
};
const tmVariants = {
  'drawer-add': { props: { drawer: 'add' }, describe: 'SideDrawer open for a new table: schema defaults (4 seats, Main Hall, Main Branch, Available, Rectangle, layout 0/0/120/80), Table Name empty with its placeholder; 512px card on a bg-black/40 blurred scrim.' },
  'drawer-edit': { props: { drawer: 'edit' }, describe: 'SideDrawer open on an existing table: title becomes Edit Dining Table, fields filled, primary action Save Changes.' },
  'grid-view': { props: { view: 'grid' }, describe: 'Grid view toggle active: table cards with shape and status badges, room name, seat count and branch.' },
  searching: { props: { query: 'rm_main' }, state: 'focus', describe: 'Search field focused with a room typed; the list is filtered to that room.' },
  'row-hover': { props: { hover: 1 }, state: 'hover', describe: 'Row hovered: bg-muted/50.' },
  empty: { props: { empty: true }, state: 'empty', describe: 'No tables configured: centred card with the Grid icon, heading, hint and Add Table.' },
  loading: { props: { loading: true }, state: 'loading', describe: 'Loading: bordered card with the primary ring spinner.' },
};

// =====================================================================================================
// 2. Branch master form (BranchPage detail view), labels from data/schemas/branch.json
// =====================================================================================================
const bfField = (k, req, inner, extra = '') => `<div class="uam-fld${extra}"><label class="uam-lbl uam-lbl--m">${T(k)}${req ? ' ' + star() : ''}</label>${inner}</div>`;
const bfRender = (v, p = {}) => {
  const off = !!p.view; const o = { lg: 1, off };
  const header = `<div class="uam-bh" ${u('ury-admin-screen-master-form.header')}><div class="uam-bh__l">${btn('u-btn--outline uam-bh__back', `${I('ArrowLeft', 16, 'ua-flipx')}<span>${T('back')}</span>`)}<div class="uam-bh__div"></div><div><h2 class="uam-bh__t">${T('branch_c')} ${T('branch')}</h2><p class="uam-bh__s">${T('addr_c')} ${T('addr_v')}</p></div></div>
${p.view ? btn('u-btn--accent uam-bh__btn', `${I('Edit2', 16)}<span>${T('edit')}</span>`, ' ' + u('ury-admin-screen-master-form.edit')) : `<button type="button" class="u-btn u-btn--accent uam-bh__btn${p.saving ? ' is-disabled' : ''}" ${u('ury-admin-screen-master-form.save')}>${I('Save', 16)}<span>${T('save')}</span></button>`}</div>`;
  const card = `<div class="uam-card uam-card--p6 uam-bs" ${u('ury-admin-screen-master-form.card')}>
<div ${u('ury-admin-screen-master-form.section-info')}><div class="uam-sh"><span class="uam-ico">${I('Building2', 16)}</span><h3>${T('s_info')}</h3></div><div class="uam-g2b">
${bfField('b_name', 0, inp('branch', { ...o, focus: p.focus, ui: 'ury-admin-screen-master-form.field-branch-name' }))}${bfField('b_addr', 0, sel('addr_v', o))}</div></div>
<div ${u('ury-admin-screen-master-form.section-fiscal')}><h3 class="uam-sh--p">${T('s_fiscal')}</h3><div class="uam-g2b">
${bfField('b_inv', 1, inp('v_inv', o))}${bfField('b_agg', 0, inp('v_agg', o))}${bfField('b_tax', 0, inp('v_tax', o))}${bfField('b_taxt', 0, inp('v_taxt', o))}</div></div>
<div ${u('ury-admin-screen-master-form.section-menu')}><div class="uam-sh"><span class="uam-ico">${I('UtensilsCrossed', 16)}</span><h3>${T('s_menu')}</h3></div><div class="uam-g2b uam-g2b--4">
${bfField('b_menu', 0, sel('v_menu', { off }))}<div class="uam-swrow uam-sw-pad">${sw(0, off)}<label>${T('b_rwm')}</label></div></div></div></div>`;
  return screen(1440, 900, adminLayout('/branch', `<div class="uam-stack" ${u('ury-admin-screen-master-form.page')}>${header}${card}</div>`), 'ury-admin-screen-master-form');
};
const bfVariants = {
  'view-mode': { props: { view: true }, describe: 'Read-only detail (isEditMode false): every field disabled (opacity-50, bg-gray-100, no shadow) and the header action is Edit.' },
  'field-focus': { props: { focus: true }, state: 'focus', describe: 'Branch Name focused: primary border and the 2px ring halo.' },
  saving: { props: { saving: true }, state: 'disabled', describe: 'Save button disabled while the request is in flight (opacity-50, pointer events off).' },
};

// =====================================================================================================
// 3. Sales Plan page (SalesPlanPage + LifecycleStepper)
// =====================================================================================================
const STEPS = ['lc_draft', 'lc_review', 'lc_approval', 'lc_prod'];
const SP = {
  draft: { idx: 0, sum: 'sum_draft', main: ['sp_submit_rev', 'Send'], editable: true },
  review: { idx: 1, sum: 'sum_prop', main: ['sp_submit_apr', 'Send'], back: ['sp_return', 'RotateCcw'] },
  approval: { idx: 1, sum: 'sum_sub', main: ['sp_approve', 'CheckCircle2'], back: ['sp_return', 'RotateCcw'], blocked: true },
  approved: { idx: 2, sum: 'sum_appr', main: ['sp_lock', 'Lock'], back: ['sp_cancel', 'X', 1] },
  locked: { idx: 3, sum: 'sum_lock', back: ['sp_cancel', 'X', 1] },
  cancelled: { idx: -1, sum: 'sum_canc', cancelled: true },
};
const lifecycle = (st) => {
  if (st.cancelled) return `<div class="uam-lc" ${u('ury-admin-screen-sales-plan.stepper')}><div class="uam-lc__l" role="list"><div class="uam-lc__s">${'<span class="uam-lc__d is-x">' + I('X', 14) + '</span>'}<span class="uam-lc__n is-x">${T('lc_cancelled')}</span></div></div><p class="uam-lc__sum">${T(st.sum)}</p></div>`;
  const steps = STEPS.map((k, i) => {
    const cls = i < st.idx ? 'is-done' : i === st.idx ? 'is-cur' : 'is-up';
    return `${i > 0 ? `<div class="uam-lc__c${i <= st.idx ? ' is-on' : ''}"></div>` : ''}<div class="uam-lc__s" ${u('ury-admin-screen-sales-plan.step-' + i)}><span class="uam-lc__d ${cls}">${i < st.idx ? I('Check', 14) : i + 1}</span><span class="uam-lc__n ${cls}">${T(k)}</span></div>`;
  }).join('');
  return `<div class="uam-lc" ${u('ury-admin-screen-sales-plan.stepper')}><div class="uam-lc__l" role="list">${steps}</div><p class="uam-lc__sum">${T(st.sum)}</p></div>`;
};
const spRow = (n, sel_) => {
  const vr = { 1: 'up', 2: 'dn', 3: 'up', 4: 'up' }[n];
  const hover = sel_ === n ? ' is-sel' : '';
  return `<tr class="${hover.trim()}" ${u('ury-admin-screen-sales-plan.row-' + n)}><td><span class="uam-it"><p class="uam-it__n">${T('i' + n)}</p><p class="uam-it__c">${T('c' + n)}</p></span></td><td><span class="uam-hist">${I('History', 16)}<span>${T('hi' + n)}</span></span></td><td><span class="uam-mut">${T('un' + (n === 3 ? 2 : n === 4 ? 3 : 1))}</span></td><td>${inp('q' + n, { cmp: 1 })}</td><td class="is-end"><span class="uam-var is-${n === 3 ? 'up' : vr}">${T('v' + n)}</span></td></tr>`;
};
const grpHead = (k, n, pl, collapsed) => `<div class="uam-grp__h"><span class="uam-grp__k">${I(collapsed ? 'ChevronDown' : 'ChevronUp', 16)}<span class="uam-grp__n">${T(k)}</span></span><div class="uam-grp__r"><span class="uam-grp__m">${T(n)}</span><span class="uam-grp__m">${T(pl)}</span></div></div>`;
const spRender = (v, p = {}) => {
  const st = SP[p.status || 'draft']; const ed = !!st.editable;
  const actions = `<div class="uam-ph__act" ${u('ury-admin-screen-sales-plan.actions')}><div class="uam-w180">${`<div class="uam-in uam-date" ${u('ury-admin-screen-sales-plan.date')}><span>${T('sp_date')}</span>${I('ChevronDown', 16)}</div>`}</div>
${ed ? `<div class="uam-w130 uam-selbox" ${u('ury-admin-screen-sales-plan.enforcement')}><div class="uam-in uam-in--sel"><span class="uam-in__t">${T('sp_hard')}</span></div>${I('ChevronDown', 16)}</div>${btn('u-btn--chrome uam-gap8', `${I('Save', 16)}<span>${T('sp_save_draft')}</span>`, ' ' + u('ury-admin-screen-sales-plan.save-draft'))}` : ''}
${st.main ? `<button type="button" class="u-btn u-btn--default uam-gap8${st.blocked ? ' is-disabled' : ''}" ${u('ury-admin-screen-sales-plan.next-action')}>${I(st.main[1], 16)}<span>${T(st.main[0])}</span></button>` : ''}
${st.back ? btn('u-btn--secondary uam-gap8' + (st.back[2] ? ' uam-btn-d' : ''), `${I(st.back[1], 16)}<span>${T(st.back[0])}</span>`, ' ' + u('ury-admin-screen-sales-plan.backward-action')) : ''}</div>`;
  const header = `<div class="uam-ph" ${u('ury-admin-screen-sales-plan.header')}><div class="uam-ph__row"><div class="uam-ph__l"><h1 class="uam-ph__title">${T('pt_title')}</h1><p class="uam-ph__desc">${T('sp_desc')}</p></div>${actions}</div>
<div class="uam-ph__ft">${lifecycle(st)}${st.blocked ? `<p class="uam-mgr">${T('sp_mgr')}</p>` : ''}</div></div>`;
  const kpis = [['k_planned', 'k_v1'], ['k_hist', 'k_v2'], ['k_items', 'k_v3'], ...(p.blocked ? [['k_blocked', 'k_v4', 'warning']] : [])];
  const kpi = `<div class="uam-sec"><div class="u-kpi-strip" ${u('ury-admin-screen-sales-plan.kpis')}>${kpis.map((k) => `<div class="u-kpi"><div class="u-kpi-label">${T(k[0])}</div><div class="u-kpi-value${k[2] ? ' u-kpi-value--' + k[2] : ''}">${T(k[1])}</div></div>`).join('')}</div></div>`;
  const att = p.blocked ? `<div class="uam-sec"><div class="uam-att" ${u('ury-admin-screen-sales-plan.needs-attention')}><div class="uam-att__h"><span class="uam-att__k">${I('ChevronDown', 16)}<span class="uam-att__t">${T('needs_att')}</span><span class="u-badge u-badge--secondary u-badge--sm">${T('k_v4')}</span></span></div></div></div>` : '';
  const search = `<div class="uam-sec"><div class="uam-search" style="width:100%;margin-bottom:16px" ${u('ury-admin-screen-sales-plan.search')}>${inp('sp_search', { search: 1, ph: 1 })}</div></div>`;
  const bar = `<div class="uam-fbar2" ${u('ury-admin-screen-sales-plan.filter-bar')}><div class="ua-fbar__l"><span class="ua-fbar__lbl">${I('ListFilter', 14)}${T('pt_jump')}</span>${['pt_d1', 'pt_d2', 'pt_d3'].map((k, i) => `<button type="button" class="ua-pill${p.hover === i ? ' is-hover' : ''}">${T(k)}</button>`).join('')}</div>${ed ? btn('u-btn--secondary u-btn--compactSm uam-gap8', `${I('Plus', 16)}<span>${T('pt_add')}</span>`, ' ' + u('ury-admin-screen-sales-plan.add-item')) : ''}</div>`;
  const kitchen = `<div class="uam-grp" ${u('ury-admin-screen-sales-plan.group-kitchen')}>${grpHead('pt_d1', 'g_k_n', 'g_k_p', false)}<div class="uam-grp__b"><div class="uam-et"><div class="uam-et__l">${inp('filter_k', { cmp: 1, ph: 1 })}</div><div class="uam-et__r">${btn('u-btn--ghost u-btn--compactSm', `${I('Download', 14)}${T('x_export')}`)}${btn('u-btn--ghost u-btn--compactSm', `${I('Upload', 14)}${T('x_import')}`)}<span class="uam-et__sep"></span>${btn('u-btn--ghost u-btn--compactSm uam-btn-d', T('x_zero'))}</div></div>
<div class="uam-dt uam-dt--flat uam-dt--fixed" ${u('ury-admin-screen-sales-plan.table')}><table><colgroup><col style="width:25%"><col style="width:33%"><col style="width:16%"><col style="width:16%"><col style="width:10%"></colgroup><thead><tr><th>${T('h_item')}</th><th>${T('h_hist')}</th><th>${T('h_unit')}</th><th>${T('h_plan')}</th><th class="is-end">${T('h_var')}</th></tr></thead><tbody>${[1, 2, 3, 4].map((n) => spRow(n)).join('')}</tbody></table></div></div></div>`;
  const groups = `<div class="uam-groups">${kitchen}<div class="uam-grp is-c" ${u('ury-admin-screen-sales-plan.group-bar')}>${grpHead('pt_d2', 'g_b_n', 'g_b_p', true)}</div><div class="uam-grp is-c" ${u('ury-admin-screen-sales-plan.group-bakery')}>${grpHead('pt_d3', 'g_c_n', 'g_c_p', true)}</div></div>`;
  const main = `<div class="uam-sp" ${u('ury-admin-screen-sales-plan.page')}>${header}${kpi}${att}${search}<div class="uam-sec">${bar}${groups}</div></div>`;
  return screen(1440, 900, adminLayout('/sales-plan', main), 'ury-admin-screen-sales-plan');
};
const spVariants = {
  review: { props: { status: 'review' }, describe: 'Status Proposed: stepper on Review, next action Submit for Approval, secondary Return to Draft; the draft-only controls (enforcement select, Save Draft, Add item) are gone.' },
  approval: { props: { status: 'approval' }, state: 'disabled', describe: 'Submitted for Approval for a non-manager: Approve is disabled and "Only managers can approve this plan." appears beside the stepper.' },
  approved: { props: { status: 'approved' }, describe: 'Status Approved: stepper on Approval with two complete steps, next action Lock for Production, destructive Cancel.' },
  locked: { props: { status: 'locked' }, describe: 'Locked for Production: every step complete, no next action, Cancel only.' },
  cancelled: { props: { status: 'cancelled' }, describe: 'Superseded/Cancelled: the stepper collapses to a destructive X badge with the terminal summary.' },
  blocked: { props: { blocked: true }, describe: 'Items without history or a production unit: a Blocked KPI in warning tone and the collapsed Needs Attention panel with its count badge.' },
  'pill-hover': { props: { hover: 1 }, state: 'hover', describe: 'Department pill hovered: bg-primary-tint.' },
};

// =====================================================================================================
// 4. Setup wizard (/setup-wizard/0 SetupPage, /setup-wizard/1 ConfigurePage) inside WizardLayout, no admin shell
// =====================================================================================================
const bcStep = (n, k, state) => `<div class="uam-wiz__bs"><span class="uam-wiz__bd is-${state === 'active' ? 'act' : state === 'done' ? 'done' : 'up'}">${state === 'done' ? I('Check', 14) : n}</span><span class="uam-wiz__bn${state === 'active' ? ' is-act' : ''}">${T(k)}</span></div>`;
const wizShell = (step, content, footerLeft, footerRight, id) => `<div class="ua uam-wiz" ${u(id)}><header class="uam-wiz__h" ${u(id + '.header')}><div class="uam-wiz__sh"><div class="uam-wiz__hi"><div class="uam-wiz__hl"><img src="${LOGO}" alt="{{w_logo}}"><div class="uam-wiz__div"></div><b>${T('w_title')}</b></div>
<div class="uam-wiz__bc" ${u(id + '.breadcrumb')}>${bcStep(1, 'w_setup', step === 1 ? 'active' : 'done')}<div class="uam-wiz__bl${step === 2 ? ' is-on' : ''}"></div>${bcStep(2, 'w_configure', step === 2 ? 'active' : 'up')}</div></div></div></header>
<main class="uam-wiz__m"><div class="uam-wiz__page"><div class="uam-card uam-card--p6" ${u(id + '.card')}>${content}</div></div></main>
<footer class="uam-wiz__f" ${u(id + '.footer')}><div class="uam-wiz__sh"><div class="uam-wiz__fi"><div>${footerLeft}</div>${footerRight}</div></div></footer></div>`;
const wfield = (cls, k, req, inner, desc, focus) => `<div class="${cls}"><div class="uam-wiz__field"><label class="uam-lbl uam-lbl--mut">${T(k)}${req ? ' ' + star(' uam-req--d') : ''}</label>${inner}${desc ? `<p class="uam-hint uam-hint--t">${T(desc)}</p>` : ''}</div></div>`;
const dateField = (k) => `<div class="uam-in uam-date" style="width:100%"><span>${T(k)}</span>${I('ChevronDown', 16)}</div>`;
const itc = (k, on) => `<div class="uam-itc${on ? ' is-on' : ''}"><div class="uam-itc__b"><h4>${T(k)}</h4>${I('Info', 16)}</div></div>`;
const wizSetup = (p, id) => {
  const content = `<div class="uam-wiz__body"><div class="uam-wiz__form"><div class="uam-wiz__fg" ${u(id + '.form')}>
${wfield('uam-c7', 'w_company', 1, inp('w_v_company', { focus: p.focus }))}${wfield('uam-c5', 'w_abbr', 1, inp('w_v_abbr'), 'w_abbr_d')}
${wfield('uam-c6', 'w_lang', 1, sel('w_v_lang'))}${wfield('uam-c6', 'w_country', 1, sel('w_v_country'))}
${wfield('uam-c6', 'w_tz', 1, sel('w_v_tz'))}${wfield('uam-c6', 'w_cur', 1, sel('w_v_cur'))}
${wfield('uam-c6', 'w_chart', 0, sel('w_v_chart'), 'w_chart_d')}${wfield('uam-c6', 'w_fy', 1, dateField('w_v_fy'), 'w_fy_d')}</div></div>
<div ${u(id + '.installation')}><h3 class="uam-wiz__h3">${T('w_install')}</h3><div class="uam-g2b">${itc('w_min', p.install !== 'advanced')}${itc('w_adv', p.install === 'advanced')}</div></div>
<label class="uam-swc" ${u(id + '.demo')}><div><b>${T('w_demo')}</b><p>${T('w_demo_d')}</p></div>${sw(!!p.demo)}</label></div>`;
  return wizShell(1, content, '', `<div class="uam-wiz__fr">${btn('u-btn--default' + (p.hover ? ' is-hover' : ''), T('w_continue'), ' ' + u(id + '.continue'))}</div>`, id);
};
const NAV = [['w_n_branch', 'Building2'], ['w_n_rooms', 'Map'], ['w_n_tables', 'Grid3X3'], ['w_n_menu', 'UtensilsCrossed'], ['w_n_pay', 'CreditCard'], ['w_n_user', 'Users']];
const wizConfigure = (p, id) => {
  const nav = `<nav class="uam-nav" ${u(id + '.sidebar')}><h2>${T('w_conf')}</h2><div>${NAV.map((n, i) => `<div><div class="uam-nav__i${i === 0 ? ' is-on' : ''}">${i === 0 ? '<span class="uam-nav__bar"></span>' : ''}<span class="uam-nav__k">${I(n[1], 16)}<span>${T(n[0])}</span></span></div></div>`).join('')}</div></nav>`;
  const f = (k, req, inner, desc) => `<div class="uam-f"><label class="uam-lbl uam-lbl--m">${T(k)}${req ? ' ' + star(' uam-req--d') : ''}</label>${inner}${desc ? `<p class="uam-hint">${T(desc)}</p>` : ''}</div>`;
  const sec = `<div class="uam-bsec" ${u(id + '.section')}>${f('w_bname', 1, inp('w_bname_v', { lg: 0 }))}${f('w_btax', 0, inp('w_ph_tax', { ph: 1 }), 'w_tax_d')}${f('w_binv', 1, inp('w_binv_v'), 'w_inv_d')}
<div class="uam-swrow">${sw(!!p.agg)}<label>${T('w_agg_sw')}</label></div>${p.agg ? f('w_bagg', 0, inp('w_agg_v'), 'w_agg_d') : ''}</div>`;
  const content = `<div class="uam-cfg"><div class="uam-cfg__s">${nav}</div><div class="uam-cfg__m"><div class="uam-sh2" ${u(id + '.section-header')}><div><h2>${T('w_s_title')}</h2><p>${T('w_s_desc')}</p></div></div>${sec}</div></div>`;
  return wizShell(2, content, btn('u-btn--outline', T('w_prev'), ' ' + u(id + '.previous')), `<div class="uam-wiz__fr"><div class="uam-wiz__fs"><span>${T('w_later')}</span>${btn('u-btn--ghost', T('w_defaults'))}</div>${btn('u-btn--default', T('w_next'), ' ' + u(id + '.next'))}</div>`, id);
};
const wzRender = (v, p = {}) => `<div class="u-screen" ${u('ury-admin-screen-setup-wizard')} style="width:1440px;height:900px;position:relative;overflow:hidden">${(p.step === 1 ? wizConfigure : wizSetup)(p, 'ury-admin-screen-setup-wizard')}</div>`;
const wzVariants = {
  configure: { props: { step: 1 }, describe: '/setup-wizard/1 (ConfigurePage): Setup step is done (primary check), Configure active; sidebar of six sections with Branch active, SectionShell heading and the BranchSection form; footer has Previous on the start and "Finish with defaults" plus Next on the end.' },
  'configure-aggregator': { props: { step: 1, agg: true }, describe: 'Configure step with the delivery-apps switch on, which reveals the Aggregator Prefix field.' },
  'advanced-selected': { props: { install: 'advanced' }, describe: 'Advanced Installation card selected (border-2 border-primary bg-primary-50).' },
  'demo-on': { props: { demo: true }, describe: 'Set up with demo data switched on.' },
  'field-focus': { props: { focus: true }, state: 'focus', describe: 'Company Name focused: primary border and ring halo.' },
  'continue-hover': { props: { hover: true }, state: 'hover', describe: 'Continue hovered: bg-foreground/90.' },
};

// =====================================================================================================
// 5. Printer configuration (PrinterConfigPage)
// =====================================================================================================
const secHead = (t, d, a) => `<div class="uam-sech"><div><h2>${T(t)}</h2><p>${T(d)}</p></div>${a || ''}</div>`;
const addBtn = (k, ui) => btn('u-btn--outline u-btn--compact uam-addrow', `${I('Plus', 14)}${T(k)}`, ui ? ' ' + u(ui) : '');
const prTable = (rows, id) => `<div ${u(id)}><div class="uam-ph3"><h3 class="uam-h3">${T('pc_printers')}</h3>${addBtn('pc_add_row')}</div><div class="uam-pt"><table><thead><tr><th>${T('pc_bill')}</th><th>${T('pc_kot')}</th><th>${T('pc_waiter')}</th><th class="uam-pt__w">${T('pc_printer')}</th><th class="uam-pt__a"></th></tr></thead><tbody>
${rows.map((r) => `<tr><td>${sw(r[0])}</td><td>${sw(r[1])}</td><td>${sw(r[2])}</td><td>${sel(r[3])}</td><td class="uam-pt__a"><span class="uam-ib">${I('Trash2', 16)}</span></td></tr>`).join('')}</tbody></table></div></div>`;
const pcRender = (v, p = {}) => {
  const net = p.noNet ? `<p class="uam-mut" style="margin:0;padding:12px 0;font-size:14px;line-height:20px">${T('pc_np_none')}</p>` : `<div class="uam-pt" ${u('ury-admin-screen-printer-config.network-table')}><table><thead><tr><th>${T('pc_np_name')}</th><th>${T('pc_np_ip')}</th><th>${T('pc_np_port')}</th><th>${T('pc_np_dev')}</th><th>${T('c_actions')}</th></tr></thead><tbody>
${[1, 2].map((n) => `<tr><td class="uam-pt__n">${T('np' + n)}</td><td class="uam-pt__m">${T('ip' + n)}</td><td class="uam-pt__m">${T('pt' + n)}</td><td class="uam-pt__m">${T('dv' + n)}</td><td><span class="uam-ib">${I('Trash2', 16)}</span></td></tr>`).join('')}</tbody></table></div>`;
  const cNet = `<div class="uam-card uam-card--p4 uam-s3" ${u('ury-admin-screen-printer-config.section-network')}>${secHead('pc_net', 'pc_net_d', addBtn('pc_add_np', 'ury-admin-screen-printer-config.add-network-printer'))}${net}</div>`;
  const cUnit = `<div class="uam-card uam-card--p4 uam-s3" ${u('ury-admin-screen-printer-config.section-unit')}>${secHead('pc_unit_t', 'pc_unit_d')}<div class="uam-maxmd"><label class="uam-lbl uam-lbl--x">${T('l_unit')}</label>${sel('v_unit')}</div><div class="uam-badges"><span class="u-badge u-badge--outline">${T('v_unit')}</span><span class="u-badge u-badge--info">${T('v_dept')}</span></div>${prTable([[1, 1, 0, 'pr1'], [0, 1, 0, 'pr2']], 'ury-admin-screen-printer-config.unit-printers')}</div>`;
  const cRoom = `<div class="uam-card uam-card--p4 uam-s3" ${u('ury-admin-screen-printer-config.section-room')}>${secHead('pc_room_t', 'pc_room_d')}<div class="uam-maxmd"><label class="uam-lbl uam-lbl--x">${T('l_room')}</label>${sel('v_room')}</div>${prTable([[1, 0, 1, 'pr1']], 'ury-admin-screen-printer-config.room-printers')}</div>`;
  const gf = (k, inner) => `<div><label class="uam-lbl uam-lbl--x">${T(k)}</label>${inner}</div>`;
  const sw2 = (k, d, on) => `<div class="uam-sw3"><div><p class="uam-p1">${T(k)}</p><p class="uam-p2">${T(d)}</p></div>${sw(on)}</div>`;
  const cPos = `<div class="uam-card uam-card--p4 uam-s3" ${u('ury-admin-screen-printer-config.section-pos-profile')}>${secHead('pc_pos_t', 'pc_pos_t', `<span class="uam-sech__a">${T('pc_pos_a')}</span>`)}<div class="uam-maxmd"><label class="uam-lbl uam-lbl--x">${T('l_pos')}</label>${sel('v_pos')}</div>
<div class="uam-s3 uam-rule uam-rule--2"><h3 class="uam-h3">${T('pc_std')}</h3><div class="uam-g2c">${gf('pc_pf', sel('v_pf'))}${gf('pc_lh', sel('v_lh'))}${gf('pc_tc', sel('v_tc'))}${gf('pc_ph', sel('v_ph'))}</div></div>
<div class="uam-s3 uam-rule"><h3 class="uam-h3">${T('pc_hw')}</h3>${sw2('pc_qz', 'pc_qz_d', 1)}${gf('pc_qzh', inp('v_host'))}${sw2('pc_reprint', 'pc_reprint_d', p.noReprint ? 0 : 1)}${p.noReprint ? '' : `<div class="uam-g3c">${gf('pc_rkf', sel('v_kf'))}${gf('pc_top', sel('pr1'))}${gf('pc_pop', sel('pr2'))}</div>`}</div>
<div class="uam-rule">${prTable([[1, 0, 0, 'pr1']], 'ury-admin-screen-printer-config.pos-printers')}</div></div>`;
  const header = `<div class="uam-tb" ${u('ury-admin-screen-printer-config.header')}><div><h1 class="uam-pc__t">${T('pc_title')}</h1><p class="uam-pc__d">${T('pc_desc')}</p></div><div class="uam-tb__r"><button type="button" class="u-btn u-btn--accent uam-pc__save${p.saving ? ' is-disabled' : ''}" ${u('ury-admin-screen-printer-config.save')}>${I('Save', 16)}${T('pc_save')}</button></div></div>`;
  const main = `<div class="uam-stack4" ${u('ury-admin-screen-printer-config.page')}>${header}<div class="uam-pc"><div class="uam-stack4">${cNet}${cUnit}${cRoom}</div><div class="uam-stack4">${cPos}</div></div></div>`;
  const dlgField = (k, req, inner) => `<div><label class="uam-lbl uam-lbl--d">${T(k)}${req ? ' ' + star() : ''}</label>${inner}</div>`;
  const dlg = p.dialog === 'add' ? `<div class="uam-dlgwrap" ${u('ury-admin-screen-printer-config.dialog')}><div class="uam-dlg"><h2 class="uam-dlg__t">${T('pc_dlg_np')}</h2><span class="uam-dlg__x">${I('X', 16)}</span><form style="margin-top:16px">${dlgField('pc_np_name', 1, inp('ph_np', { ph: 1 }))}${dlgField('pc_np_ip', 0, inp('v_host', { ph: 1 }))}${dlgField('pc_np_port', 0, inp('pt1', { ph: 1 }))}${dlgField('pc_np_dev', 1, inp('ph_dev', { ph: 1 }))}<div class="uam-foot uam-foot--m">${btn('u-btn--outline uam-fw6', T('cancel'))}${btn('u-btn--accent uam-fw6', `${I('Plus', 16)}<span>${T('pc_dlg_add')}</span>`)}</div></form></div></div>`
    : p.dialog === 'delete' ? `<div class="uam-dlgwrap" ${u('ury-admin-screen-printer-config.dialog')}><div class="uam-dlg"><h2 class="uam-dlg__t">${T('pc_del_t')}</h2><span class="uam-dlg__x">${I('X', 16)}</span><p class="uam-dlg__p">${T('pc_del_a')} <b>${T('np1')}</b>${T('pc_del_b')}</p><div class="uam-foot uam-foot--m">${btn('u-btn--outline uam-fw6', T('cancel'))}${btn('u-btn--destructive uam-fw6', `${I('Trash2', 16)}<span>${T('pc_delete')}</span>`)}</div></div></div>` : '';
  return screen(1440, 900, adminLayout('/printer-config', main) + dlg, 'ury-admin-screen-printer-config');
};
const pcVariants = {
  'add-printer-dialog': { props: { dialog: 'add' }, describe: 'Add Network Printer dialog: max-w-md card with four fields (name and device are required), Cancel and the accent Add Printer button.' },
  'delete-printer-dialog': { props: { dialog: 'delete' }, describe: 'Delete Network Printer confirmation naming the printer, with a destructive Delete action.' },
  'no-network-printers': { props: { noNet: true }, state: 'empty', describe: 'Network Printers card with no endpoints: the muted "No network printers configured." line.' },
  'reprint-off': { props: { noReprint: true }, describe: 'Enable KOT Reprint switched off: the three reprint selects disappear.' },
  saving: { props: { saving: true }, state: 'disabled', describe: 'Save Changes disabled while saving.' },
};

// =====================================================================================================
const NA = (what) => ({ disabled: `not applicable: ${what} has no disabled state beyond the variants shown`, error: `not applicable: ${what} has no error state in this mock (server errors surface as toasts)`, loading: `not applicable: ${what} has no loading state beyond the variants shown`, empty: `not applicable: ${what} has no empty state beyond the variants shown` });
const spec = (id, name, render, variants, describe, na, extra = {}) => ({ ...base, id, name, slots: slotsOf(all(render, variants)), rtlValues: rtlOf(all(render, variants)), props: {}, render, variants, describe, na, ...extra });

export const specs = [
  spec('ury-admin-screen-master-list', 'URY admin master list (Table)', tmRender, tmVariants,
    ['Schema-driven master list: the Table master from data/schemas/table.json inside the admin shell. Full-bleed toolbar (view toggle, search, Edit Layout, Add Table), a DataTable of tables with shape and status badges, and the SideDrawer form (512px card over a blurred scrim) in the open variants.', 'Use for any admin master doctype list that edits through a drawer (Table, Room, Menu). Column and field labels are the schema titles; the toolbar search follows the master-list pattern, the source TablePage itself has no search box.'],
    NA('the master list')),
  spec('ury-admin-screen-master-form', 'URY admin master form (Branch)', bfRender, bfVariants,
    ['Branch master detail form (BranchPage) inside the admin shell: Back / title / Save header, then one card with Branch Info, Fiscal & Operational Identification (data/schemas/branch.json fields plus Default Tax Template) and Menu sections.', 'Use as the pattern for a sectioned master form: icon-chip section headers, two-column grid, required marks, disabled read-only mode.'],
    NA('the master form')),
  spec('ury-admin-screen-sales-plan', 'URY admin Sales Plan', spRender, spVariants,
    ['SalesPlanPage inside the admin shell: PageHeader with date, enforcement mode, Save Draft and the next lifecycle action, the four-step lifecycle stepper with its summary, KPI strip, item search, the sticky Jump-to bar and department groups (Kitchen open with an editable Plan column, Bar and Bakery collapsed).', 'Show the status variants to document each stepper stage. The Plan column inputs are compact Inputs; the table uses fixed column widths to approximate the auto layout.'],
    { ...NA('the Sales Plan page'), hover: STATE_NA.desktop }),
  spec('ury-admin-screen-setup-wizard', 'URY admin setup wizard', wzRender, wzVariants,
    ['Setup wizard full-page card, no admin shell (WizardLayout): header with logo, title and two-step breadcrumb, a Card with the setup form (/setup-wizard/0) or the Configure sidebar and Branch section (/setup-wizard/1), and the sticky footer navigation.', 'First-run flow after install: Setup collects company, country and installation type; Configure walks branch, rooms, tables, menu, payments and staff.'],
    NA('the wizard')),
  spec('ury-admin-screen-printer-config', 'URY admin printer configuration', pcRender, pcVariants,
    ['Printer Configuration page inside the admin shell: header with Save Changes, Network Printers table, Production Unit and Room assignment cards and the POS Profile print and QZ settings, in a two-column grid.', 'Use for hardware setup. The Server IP column shows hostnames; the add and delete dialogs are separate variants.'],
    NA('the printer page')),
];
