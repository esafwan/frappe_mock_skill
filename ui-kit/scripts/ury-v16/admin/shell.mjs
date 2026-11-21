// URY v16 admin shell markup helpers (frontend/src/components/layout/{DashboardLayout,Header,Sidebar,Breadcrumbs,PageToolbar,DayStatusCard}.tsx).
// adminLayout(activeRoute, mainHtml, opts) is the entry point for the admin screens (T20-T22).
import { ic } from '../lib.mjs';

// lucide-react 0.525 paths (ISC) for icons beyond ../icons.mjs
const EXTRA = {
  LayoutDashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  Target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  ClipboardList: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  ClipboardCheck: '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
  TrendingUp: '<path d="M16 7h6v6"/><path d="m22 7-8.5 8.5-5-5L2 17"/>',
  Percent: '<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  Gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  Lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  Trash2: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  BookmarkCheck: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/><path d="m9 10 2 2 4-4"/>',
  AlertCircle: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  Ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  BarChart3: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  Settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  PanelLeftClose: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>',
  PanelLeftOpen: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>',
  ChevronDown: '<path d="m6 9 6 6 6-6"/>',
  Building: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  Building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
  Store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  Check: '<path d="M20 6 9 17l-5-5"/>',
  ExternalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  Bell: '<path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>',
  User: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  Sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
  RefreshCw: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  LogOut: '<path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>',
  Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  CalendarDays: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  Receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
  PieChart: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>',
  Clock: '<path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/>',
  Package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
  ShoppingCart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',
  UserPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  Repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  UserCog: '<path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m14.305 16.53.923-.382"/><path d="m15.228 13.852-.923-.383"/><path d="m16.852 12.228-.383-.923"/><path d="m16.852 17.772-.383.924"/><path d="m19.148 12.228.383-.923"/><path d="m19.53 18.696-.382-.924"/><path d="m20.772 13.852.924-.383"/><path d="m20.772 16.148.924.383"/><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/>',
  Factory: '<path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/>',
  IndianRupee: '<path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/>',
  Layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',
  Table2: '<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>',
  DoorOpen: '<path d="M11 20H2"/><path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"/><path d="M14 12h.01"/><path d="M22 20h-3"/>',
  SlidersHorizontal: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  Smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  CreditCard: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  FileCog: '<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m2.305 15.53.923-.382"/><path d="m3.228 12.852-.924-.383"/><path d="M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5"/><path d="m4.852 11.228-.383-.923"/><path d="m4.852 16.772-.383.924"/><path d="m7.148 11.228.383-.923"/><path d="m7.53 17.696-.382-.924"/><path d="m8.772 12.852.923-.383"/><path d="m8.772 15.148.923.383"/><circle cx="6" cy="14" r="3"/>',
  Bot: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>',
  Network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  Boxes: '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>',
  ListFilter: '<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>',
  Utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  Globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  Plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  List: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  Grid3X3: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',
};

// URY-bg.png (frontend/Public), downscaled to 96px
const LOGO='data:image/png;base64,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';

const I = (n, s = 16, c = '') => ic(n, s, c, EXTRA);
const T = (k) => `{{${k}}}`;

// ---------- copy: key -> [English (source __() strings), Arabic (ury/translations/ar.csv)] ----------
// Arabic for "Plan", "Setup", "Menu", the sample company/branch/department names and the sample date is translated here (no entry in ar.csv).
export const D = {
  company: ['Bay Leaf Hospitality', 'Bay Leaf Hospitality'], branch: ['Marina Branch', 'Marina Branch'],
  user: ['Admin User', 'Admin User'], unread: ['3', '3'], logo_alt: ['URY Logo', 'شعار URY'],
  ask_tag: ['HUF', 'HUF'], ask_hint: ['Ask about tonight…', 'اسأل عن الليلة…'], ask_key: ['⌘K', '⌘K'],
  open_pos: ['Open POS', 'فتح نقطة البيع'], notif_label: ['Open notifications', 'فتح الإشعارات'],
  collapse: ['Collapse sidebar', 'طي الشريط الجانبي'], expand: ['Expand sidebar', 'توسيع الشريط الجانبي'],
  g_plan: ['Plan', 'خطة'], g_operate: ['Operate', 'التشغيل'], g_observe: ['Observe', 'المتابعة'], g_control: ['Control', 'الرقابة'], g_reports: ['Reports', 'تقارير'], g_setup: ['Setup', 'الإعداد'],
  n_sales_plan: ['Sales Plan', 'خطة المبيعات'], n_requirements: ['Requirements', 'المتطلبات'], n_service_board: ['Service Board', 'لوحة الخدمة'], n_service: ['Service', 'الخدمة'],
  n_profitability: ['Profitability', 'الربحية'], n_yield_variance: ['Yield Variance', 'فروقات المردود'], n_yield_compliance: ['Yield Compliance', 'الالتزام بالمردود'], n_close_day: ['Close Day', 'إقفال اليوم'],
  n_wastage: ['Wastage', 'الهدر'], n_yield_checks: ['Yield Checks', 'فحوصات المردود'], n_reservations: ['Reservations', 'الحجوزات'], n_kot_errors: ['KOT Errors', 'أخطاء أوامر المطبخ'], n_sellability: ['Sellability', 'قابلية البيع'],
  rg_sales: ['Sales Summary', 'ملخص المبيعات'], rg_customers: ['Customers & Items', 'العملاء والأصناف'], rg_employees: ['Employees & Operations', 'الموظفون والتشغيل'], rg_financial: ['Financial', 'مالي'],
  r_today: ["Today's Sales", 'مبيعات اليوم'], r_daywise: ['Daywise Sales', 'المبيعات حسب اليوم'], r_daywise_inv: ['Daywise Invoices', 'الفواتير حسب اليوم'], r_month: ['Month Wise Sales', 'المبيعات حسب الشهر'],
  r_time: ['Time Wise Sales', 'المبيعات حسب الوقت'], r_service: ['Service Wise Sales', 'المبيعات حسب نوع الخدمة'], r_cancelled: ['Cancelled Invoices', 'الفواتير الملغاة'], r_avg_bill: ['Average Bill Value', 'متوسط قيمة الفاتورة'],
  r_item_sales: ['Item Wise Sales', 'المبيعات حسب الصنف'], r_item_hist: ['Item-wise Purchase History', 'سجل المشتريات حسب الصنف'], r_customer: ['Customer Data', 'بيانات العملاء'], r_cust_daywise: ['Daywise Customer Details', 'تفاصيل العملاء حسب اليوم'], r_repeat: ['Repeated Customers', 'العملاء المتكررون'],
  r_emp_sales: ['Employee Sales', 'مبيعات الموظفين'], r_emp_comm: ['Employee Commission', 'عمولة الموظفين'], r_emp_item: ['Employee Item Wise Sales', 'مبيعات الموظف حسب الصنف'], r_work_orders: ['Completed Work Orders', 'أوامر العمل المكتملة'], r_pnl: ['Daily P&L', 'الأرباح والخسائر اليومية'],
  s_item: ['Item', 'الصنف'], s_menu: ['Menu', 'القائمة'], s_bom: ['BOM', 'BOM'], s_tables: ['Tables', 'الطاولات'], s_rooms: ['Rooms', 'القاعات'], s_pos_profile: ['POS Profile', 'الملف الشخصي لنقطة البيع'], s_users: ['Users', 'المستخدمون'],
  s_branches: ['Branches', 'الفروع'], s_self_ordering: ['Self Ordering', 'الطلب الذاتي'], s_aggregators: ['Aggregators', 'منصات التجميع'], s_terminals: ['Payment Terminals', 'أجهزة الدفع'], s_printer: ['Printer Configuration', 'إعدادات الطابعة'],
  s_report_settings: ['Report Settings', 'إعدادات التقارير'], s_ai: ['AI Assistant', 'المساعد الذكي'], s_commission: ['Commission', 'العمولة'], s_units: ['Production Units', 'وحدات الإنتاج'], s_depts: ['Departments', 'الأقسام'], s_item_config: ['Item Config', 'إعداد الأصناف'], s_yield_standards: ['Yield Standards', 'معايير المردود'],
  day_date: ['Fri, 21 Nov', 'الجمعة، 21 نوفمبر'], day_status: ['Approved', 'معتمدة'], day_attention: ['3', '3'], day_need: ['need attention', 'بحاجة إلى متابعة'], day_open: ['Open', 'فتح'],
  sm_title_company: ['Select Active Company', 'اختر الشركة النشطة'], sm_title_branch: ['Select Active Branch', 'اختر الفرع النشط'], sm_all_companies: ['All Companies', 'كل الشركات'], sm_all_branches: ['All Branches', 'كل الفروع'],
  sm_c1: ['Bay Leaf Hospitality', 'Bay Leaf Hospitality'], sm_c2: ['Saffron Table Group', 'مجموعة مائدة الزعفران'], sm_c3: ['Harbour Kitchens', 'مطابخ الميناء'],
  sm_b1: ['Marina Branch', 'Marina Branch'], sm_b2: ['Old Town Branch', 'فرع البلدة القديمة'], sm_b3: ['Airport Road Branch', 'فرع طريق المطار'],
  pt_title: ['Sales Plan — Fri, 21 Nov · Marina Branch', 'خطة المبيعات — الجمعة، 21 نوفمبر · Marina Branch'],
  pt_jump: ['Jump to:', 'انتقل إلى:'], pt_d1: ['Kitchen', 'المطبخ'], pt_d2: ['Bar', 'البار'], pt_d3: ['Bakery', 'المخبز'], pt_add: ['Add item', 'إضافة صنف'],
};
export const SHELL_SLOTS = Object.fromEntries(Object.entries(D).map(([k, v]) => [k, v[0]]));
export const SHELL_RTL = Object.fromEntries(Object.entries(D).map(([k, v]) => [k, v[1]]));
const keysIn = (html) => [...new Set([...String(html).matchAll(/\{\{([a-z0-9_]+)\}\}/g)].map((m) => m[1]))].filter((k) => k in D);
/** Slot / rtlValues maps for exactly the {{keys}} a set of rendered html strings uses. */
export const shellSlots = (...htmls) => Object.fromEntries(keysIn(htmls.join('')).map((k) => [k, D[k][0]]));
export const shellRtl = (...htmls) => Object.fromEntries(keysIn(htmls.join('')).map((k) => [k, D[k][1]]));

// ---------- nav model (frontend/src/components/layout/Sidebar.tsx NAV_GROUPS, SETUP_ITEMS, Reports registry) ----------
export const NAV_GROUPS = [
  { key: 'plan', items: [['/sales-plan', 'n_sales_plan', 'Target'], ['/requirements', 'n_requirements', 'ClipboardList']] },
  { key: 'operate', items: [['/dashboard', 'n_service_board', 'LayoutDashboard'], ['/service', 'n_service', 'ClipboardCheck']] },
  { key: 'observe', items: [['/department-profitability', 'n_profitability', 'TrendingUp'], ['/yield-variance', 'n_yield_variance', 'Percent'], ['/yield-compliance', 'n_yield_compliance', 'Gauge'], ['/close-day', 'n_close_day', 'Lock']] },
  { key: 'control', items: [['/wastage', 'n_wastage', 'Trash2'], ['/overdue-yield-checks', 'n_yield_checks', 'ClipboardCheck'], ['/stock-reservations', 'n_reservations', 'BookmarkCheck'], ['/kot-error-log', 'n_kot_errors', 'AlertCircle'], ['/menu-routing', 'n_sellability', 'Ban']] },
];
export const SETUP_ITEMS = [
  ['/item', 's_item', 'Package'], ['/menu', 's_menu', 'Utensils'], ['/bom', 's_bom', 'Layers'], ['/table', 's_tables', 'Table2'], ['/room', 's_rooms', 'DoorOpen'], ['/pos-profile', 's_pos_profile', 'SlidersHorizontal'],
  ['/user', 's_users', 'Users'], ['/branch', 's_branches', 'Building2'], ['/self-ordering-profile', 's_self_ordering', 'Smartphone'], ['/aggregator', 's_aggregators', 'Globe'], ['/payment-terminals', 's_terminals', 'CreditCard'],
  ['/printer-config', 's_printer', 'Printer'], ['/report-settings', 's_report_settings', 'FileCog'], ['/ai-settings', 's_ai', 'Bot'], ['/commission-settings', 's_commission', 'Percent'], ['/production-unit', 's_units', 'Factory'],
  ['/production-department', 's_depts', 'Network'], ['/item-production-config', 's_item_config', 'Boxes'], ['/yield-standards', 's_yield_standards', 'Target'],
];
export const REPORT_GROUPS = [
  { key: 'rg_sales', items: [['today-sales', 'r_today', 'Sun'], ['daywise-sales', 'r_daywise', 'CalendarDays'], ['daywise-invoices', 'r_daywise_inv', 'Receipt'], ['month-wise-sales', 'r_month', 'BarChart3'], ['time-wise-sales', 'r_time', 'Clock'], ['service-wise-sales', 'r_service', 'PieChart'], ['cancelled-invoices', 'r_cancelled', 'Ban'], ['average-bill-value', 'r_avg_bill', 'Gauge']] },
  { key: 'rg_customers', items: [['item-wise-sales', 'r_item_sales', 'Package'], ['item-wise-purchase-history', 'r_item_hist', 'ShoppingCart'], ['customer-data', 'r_customer', 'Users'], ['daywise-customer-details', 'r_cust_daywise', 'UserPlus'], ['repeated-customers', 'r_repeat', 'Repeat']] },
  { key: 'rg_employees', items: [['employee-sales', 'r_emp_sales', 'UserCog'], ['employee-commission', 'r_emp_comm', 'Percent'], ['employee-item-wise-sales', 'r_emp_item', 'ClipboardList'], ['completed-work-orders', 'r_work_orders', 'Factory']] },
  { key: 'rg_financial', items: [['daily-pnl', 'r_pnl', 'IndianRupee']] },
];
// activeRoute -> { group: 'g_*' key, label: key, section }. Same prefix rule as Breadcrumbs.tsx.
export function resolveRoute(route = '') {
  if (route.startsWith('/reports')) {
    const p = route.replace(/^\/reports\/?/, '');
    for (const g of REPORT_GROUPS) for (const [path, label] of g.items) if (path === p) return { group: 'g_reports', label, section: 'reports', path };
    return { group: 'g_reports', label: null, section: 'reports', path: p };
  }
  for (const g of NAV_GROUPS) for (const [path, label] of g.items) if (route === path || route.startsWith(path + '/')) return { group: 'g_' + g.key, label, section: g.key, path };
  for (const [path, label] of SETUP_ITEMS) if (route === path || route.startsWith(path + '/')) return { group: 'g_setup', label, section: 'setup', path };
  return null;
}

const u = (id) => `data-ui="${id}"`;
const slug = (s) => s.replace(/^\//, '').replace(/\//g, '-');

// ---------- Breadcrumbs ----------
export const breadcrumbs = (route, id = 'ury-admin-header.breadcrumbs') => {
  const r = resolveRoute(route); if (!r || !r.label) return '';
  return `<div class="ua-crumbs" ${u(id)}><span class="ua-crumbs__g">${T(r.group)}</span><span class="ua-crumbs__s">/</span><span class="ua-crumbs__l">${T(r.label)}</span></div>`;
};

// ---------- Header ----------
export const adminHeader = (route = '/sales-plan', p = {}) => `<header class="ua ua-header" ${u('ury-admin-header')}><div class="ua-header__in">
<div class="ua-header__l"><a class="ua-logo" ${u('ury-admin-header.logo')}><img src="${LOGO}" alt="{{logo_alt}}"></a><div class="ua-divider" ${u('ury-admin-header.divider')}></div>${breadcrumbs(route)}</div>
<div class="ua-header__r">
<div class="ua-ask-wrap"><button type="button" class="ua-ask" ${u('ury-admin-header.ask')}><span class="ua-ask__tag">${T('ask_tag')}</span><span class="ua-ask__txt">${I('Sparkles', 14)}<span class="ua-trunc">${T('ask_hint')}</span></span><span class="ua-ask__key">${T('ask_key')}</span></button></div>
<button type="button" class="ua-scope${p.hover === 'company' ? ' is-hover' : ''}" ${u('ury-admin-header.company')}>${I('Building', 16, 'ua-mut')}<span class="ua-scope__t">${T('company')}</span>${I('ChevronDown', 16, 'ua-mut')}</button>
<button type="button" class="ua-scope${p.hover === 'branch' ? ' is-hover' : ''}" ${u('ury-admin-header.branch')}>${I('Building2', 16, 'ua-mut')}<span class="ua-scope__t">${T('branch')}</span>${I('ChevronDown', 16, 'ua-mut')}</button>
<a class="u-btn u-btn--chrome u-btn--xs ua-pos${p.hover === 'pos' ? ' is-hover' : ''}" ${u('ury-admin-header.open-pos')}>${I('ExternalLink', 16)}<span>${T('open_pos')}</span></a>
<button type="button" class="ua-bell${p.hover === 'bell' ? ' is-hover' : ''}" aria-label="{{notif_label}}" ${u('ury-admin-header.bell')}>${I('Bell', 16)}${p.unread === false ? '' : `<span class="ua-bell__n" ${u('ury-admin-header.bell-count')}>${T('unread')}</span>`}</button>
<button type="button" class="ua-user${p.hover === 'user' ? ' is-hover' : ''}" ${u('ury-admin-header.user')}><span class="ua-user__av">${I('User', 14, 'ua-mut')}</span><span class="ua-user__n">${T('user')}</span>${I('ChevronDown', 16, 'ua-mut')}</button>
</div></div></header>`;

// ---------- Scope menu (company / branch dropdown) ----------
export const scopeMenu = (p = {}) => {
  const kind = p.kind || 'company'; const sel = p.selected ?? 'all'; // 'all' | 0..2
  const all = kind === 'company' ? 'sm_all_companies' : 'sm_all_branches'; const icon = kind === 'company' ? 'Building' : 'Store';
  const names = [1, 2, 3].map((n) => `sm_${kind === 'company' ? 'c' : 'b'}${n}`);
  const row = (on, inner, extra = '', ui = '', hover = false) => `<button type="button" class="ua-menu__i${on ? ' is-on' : ''}${hover ? ' is-hover' : ''}" ${ui}><div class="ua-menu__l${extra}">${inner}</div>${on ? I('Check', 16, 'ua-menu__ck') : ''}</button>`;
  return `<div class="ua ua-menu" ${u('ury-admin-scope-menu')}><div class="ua-menu__h" ${u('ury-admin-scope-menu.title')}>${T(kind === 'company' ? 'sm_title_company' : 'sm_title_branch')}</div>
${row(sel === 'all', `${I(icon, 16)}<span>${T(all)}</span>`, '', u('ury-admin-scope-menu.all'), p.hover === 'all')}<div class="ua-menu__div"></div>
${names.map((k, i) => row(sel === i, `<span class="ua-trunc">${T(k)}</span>`, ' ua-trunc-box', u(`ury-admin-scope-menu.item-${i}`), p.hover === i)).join('')}</div>`;
};

// ---------- Sidebar ----------
const link = (path, label, icon, o) => {
  const on = o.active === path; const hv = o.hover === path;
  return `<a class="ua-link${on ? ' is-on' : ''}${hv ? ' is-hover' : ''}${o.collapsed ? ' is-c' : ''}"${o.collapsed ? ` title="${T(label)}" aria-label="${T(label)}"` : ''} ${u('ury-admin-sidebar.link.' + slug(path))}>${I(icon, 16)}${o.collapsed ? '' : `<span>${T(label)}</span>`}</a>`;
};
const gh = (label, isOpen, isActive, icon, ui) => `<button type="button" class="ua-gh${isActive ? ' is-on' : ''}${isOpen ? ' is-open' : ''}" aria-expanded="${isOpen}" ${u(ui)}><span class="ua-gh__l">${icon ? I(icon, 14) : ''}<span>${T(label)}</span></span>${I('ChevronDown', 14, 'ua-gh__c')}</button>`;
const seg = (i, cur) => `<span class="ua-ph ${i < cur ? 'is-done' : i === cur ? 'is-cur' : ''}"></span>`;
export const dayStatusCard = (p = {}) => {
  const cur = p.phase ?? 0; const segs = [0, 1, 2, 3, 4, 5].map((i) => seg(i, cur)).join('');
  if (p.collapsed) return `<div class="ua-day ua-day--c" ${u('ury-admin-sidebar.day-card')}><span class="ua-day__dot"></span><div class="ua-day__ph ua-day__ph--c">${segs}</div><span class="u-badge u-badge--warning u-badge--sm ua-day__bc">${T('day_attention')}</span></div>`;
  return `<div class="ua-day" ${u('ury-admin-sidebar.day-card')}><div class="ua-day__top"><span class="ua-day__date">${T('day_date')}</span><span class="ua-day__st"><span class="ua-day__dot"></span>${T('day_status')}</span></div>
<div class="ua-day__ph">${segs}</div><div class="ua-day__foot"><span class="u-badge u-badge--warning u-badge--sm">${T('day_attention')}</span><span class="ua-day__need">${T('day_need')}</span><span class="ua-day__open">${T('day_open')} <span class="ua-flip">→</span></span></div></div>`;
};
/** p: {collapsed, reports (open), setup (open), active (route), hover (path), phase} */
export const adminSidebar = (route = '/sales-plan', p = {}) => {
  const c = !!p.collapsed; const r = resolveRoute(route) || {}; const o = { collapsed: c, active: r.section === 'reports' ? null : r.path ? (r.section === 'setup' || NAV_GROUPS.some((g) => g.key === r.section) ? r.path : null) : null, hover: p.hover };
  const repOpen = p.reports || r.section === 'reports'; const setOpen = p.setup || r.section === 'setup';
  const reportActive = (path) => r.section === 'reports' && r.path === path;
  const groups = NAV_GROUPS.map((g) => `<div class="ua-grp">${c ? '' : gh('g_' + g.key, true, r.section === g.key, null, 'ury-admin-sidebar.group.' + g.key)}${g.items.map(([pa, l, ic_]) => link(pa, l, ic_, o)).join('')}</div>`).join('');
  const reps = `<div class="ua-rep"><div>${c ? `<button type="button" class="ua-link is-c${r.section === 'reports' ? ' is-on' : ''}" aria-expanded="${!!repOpen}" aria-label="${T('g_reports')}" title="${T('g_reports')}" ${u('ury-admin-sidebar.group.reports')}>${I('BarChart3', 16)}</button>` : gh('g_reports', !!repOpen, r.section === 'reports', 'BarChart3', 'ury-admin-sidebar.group.reports')}</div>
${repOpen ? `<div class="ua-rep__body${c ? ' is-c' : ''}">${REPORT_GROUPS.map((g) => `<div>${c ? '' : `<h4 class="ua-rep__h">${T(g.key)}</h4>`}<div class="ua-rep__l">${g.items.map(([pa, l, ic_]) => `<a class="ua-link${reportActive(pa) ? ' is-on' : ''}${p.hover === 'reports/' + pa ? ' is-hover' : ''}${c ? ' is-c' : ''}"${c ? ` title="${T(l)}" aria-label="${T(l)}"` : ''} ${u('ury-admin-sidebar.link.reports-' + pa)}>${I(ic_, 16)}${c ? '' : `<span>${T(l)}</span>`}</a>`).join('')}</div></div>`).join('')}</div>` : ''}</div>`;
  const setup = `<div class="ua-foot${c ? ' is-c' : ''}">${c ? `<button type="button" class="ua-link is-c${r.section === 'setup' ? ' is-on' : ''}" aria-expanded="${!!setOpen}" aria-label="${T('g_setup')}" title="${T('g_setup')}" ${u('ury-admin-sidebar.group.setup')}>${I('Settings', 16)}</button>` : gh('g_setup', !!setOpen, r.section === 'setup', 'Settings', 'ury-admin-sidebar.group.setup')}${setOpen ? `<div class="ua-foot__l">${SETUP_ITEMS.map(([pa, l, ic_]) => link(pa, l, ic_, o)).join('')}</div>` : ''}</div>`;
  return `<aside class="ua ua-sidebar${c ? ' is-c' : ''}" ${u('ury-admin-sidebar')}><div class="ua-sb-top${c ? ' is-c' : ''}"><button type="button" class="ua-sb-toggle" title="${T(c ? 'expand' : 'collapse')}" aria-label="${T(c ? 'expand' : 'collapse')}" ${u('ury-admin-sidebar.toggle')}>${I(c ? 'PanelLeftOpen' : 'PanelLeftClose', 16, 'ua-flipx')}</button></div>
<div class="ua-sb-main">${dayStatusCard({ collapsed: c, phase: p.phase })}<div class="ua-sb-nav${c ? ' is-c' : ''}">${groups}<div class="ua-grp">${reps}</div></div>${setup}</div></aside>`;
};

// ---------- Page toolbar + sticky filter bar ----------
export const pageToolbar = (route = '/sales-plan', p = {}) => `<div class="ua ua-pagebar" ${u('ury-admin-page-toolbar')}>
<div class="ua-pt" ${u('ury-admin-page-toolbar.bar')}><div class="ua-pt__l">${breadcrumbs(route, 'ury-admin-page-toolbar.breadcrumbs')}<h1 class="ua-pt__title" ${u('ury-admin-page-toolbar.title')}>${T('pt_title')}</h1></div>
<div class="ua-pt__r"><div class="ua-seg"><span class="ua-seg__b is-on">${I('List', 16)}</span><span class="ua-seg__b">${I('Grid3X3', 16)}</span></div></div></div>
${p.filters === false ? '' : `<div class="ua-fbar" ${u('ury-admin-page-toolbar.filter-bar')}><div class="ua-fbar__l"><span class="ua-fbar__lbl">${I('ListFilter', 14)}${T('pt_jump')}</span>${['pt_d1', 'pt_d2', 'pt_d3'].map((k, i) => `<button type="button" class="ua-pill${p.hover === i ? ' is-hover' : ''}" ${u('ury-admin-page-toolbar.pill-' + i)}>${T(k)}</button>`).join('')}</div>
<button type="button" class="u-btn u-btn--secondary u-btn--compactSm ua-add" ${u('ury-admin-page-toolbar.add')}>${I('Plus', 16)}<span>${T('pt_add')}</span></button></div>`}</div>`;

// ---------- Layout for T20-T22 ----------
/** h-screen column: header, then sidebar + scrolling main (p-6). Put the result inside screen(w, h, ...). Slots: spread shellSlots(html) / shellRtl(html) into the screen spec. */
export function adminLayout(activeRoute, mainHtml, opts = {}) {
  return `<div class="ua ua-layout"><div class="ua-layout__h">${adminHeader(activeRoute, opts.header || {}).replace('data-ui="ury-admin-header"', 'data-ui="ury-admin-header"')}</div><div class="ua-layout__body">${adminSidebar(activeRoute, opts.sidebar || { collapsed: !!opts.collapsed, reports: !!opts.reportsOpen })}<main class="ua-main" data-ui="ury-admin-main">${mainHtml}</main></div></div>`;
}
