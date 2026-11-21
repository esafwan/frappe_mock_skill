// URY v16 desk navigation helpers (T24): sidebar, dock and shell markup built from frappe v16.55.2 sidebar/dock templates and URY's sidebar/dock JSON.
// Data below is read from ury/ury/sidebar/ury/ury.json, ury/ury_pos/sidebar/pos_operations/pos_operations.json and ury/dock/ury/ury.json (ury-erp/version-16 @100c43fe2e);
// Arabic labels are from ury/translations/ar.csv, and 7 fixed labels with no entry there (Plan, Orders, Menu, Setup, POS Operations, Notification, URY) are translated by hand.
import { screen } from '../lib.mjs';
export const D = {
 "home": {
  "k": "nav_home",
  "label": "Home",
  "ar": "الصفحة الرئيسية",
  "icon": "house",
  "link_type": "Workspace",
  "url": ""
 },
 "sections": [
  {
   "k": "nav_s0",
   "label": "Apps",
   "ar": "التطبيقات",
   "icon": "app-window",
   "children": [
    {
     "k": "nav_s0_0",
     "label": "Open POS",
     "ar": "فتح نقطة البيع",
     "icon": "",
     "link_type": "URL",
     "url": "/pos"
    },
    {
     "k": "nav_s0_1",
     "label": "Kitchen Display",
     "ar": "شاشة المطبخ",
     "icon": "",
     "link_type": "URL",
     "url": "/mosaic"
    },
    {
     "k": "nav_s0_2",
     "label": "URY Console",
     "ar": "لوحة URY",
     "icon": "",
     "link_type": "URL",
     "url": "/ury"
    }
   ]
  },
  {
   "k": "nav_s1",
   "label": "Plan",
   "ar": "التخطيط",
   "icon": "calendar-check",
   "children": [
    {
     "k": "nav_s1_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s1_1",
     "label": "Sales Plans",
     "ar": "خطط المبيعات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s1_2",
     "label": "Production Settings",
     "ar": "إعدادات الإنتاج",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s1_3",
     "label": "Item Production Setup",
     "ar": "إعداد إنتاج الأصناف",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s1_4",
     "label": "Bulk Production",
     "ar": "الإنتاج بالجملة",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s2",
   "label": "Operate",
   "ar": "التشغيل",
   "icon": "chef-hat",
   "children": [
    {
     "k": "nav_s2_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s2_1",
     "label": "Orders",
     "ar": "الطلبات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s2_2",
     "label": "Kitchen Orders",
     "ar": "أوامر المطبخ",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s2_3",
     "label": "Tables",
     "ar": "الطاولات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s2_4",
     "label": "Rooms",
     "ar": "القاعات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s2_5",
     "label": "Ordering Sessions",
     "ar": "جلسات الطلب",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s2_6",
     "label": "Sub POS Closing",
     "ar": "إقفال نقطة البيع الفرعية",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s2_7",
     "label": "Service Requests",
     "ar": "طلبات الخدمة",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s2_8",
     "label": "Payment Terminals",
     "ar": "أجهزة الدفع",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s2_9",
     "label": "Terminal Transactions",
     "ar": "معاملات أجهزة الدفع",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s3",
   "label": "Observe",
   "ar": "المتابعة",
   "icon": "eye",
   "children": [
    {
     "k": "nav_s3_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s3_1",
     "label": "Daily P&L",
     "ar": "الأرباح والخسائر اليومية",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s3_2",
     "label": "Yield Checks",
     "ar": "فحوصات المردود",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s3_3",
     "label": "Food Cost & Margin",
     "ar": "تكلفة الطعام والهامش",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s3_4",
     "label": "RevPASH Report",
     "ar": "تقرير الإيراد لكل مقعد في الساعة (RevPASH)",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s3_5",
     "label": "Table Turnaround Delay",
     "ar": "تأخر دوران الطاولات",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s3_6",
     "label": "Avg Per Cover",
     "ar": "متوسط الإنفاق للفرد",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s3_7",
     "label": "Cost Variance Snapshot",
     "ar": "لقطة فروقات التكلفة",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s4",
   "label": "Control",
   "ar": "الرقابة",
   "icon": "shield-check",
   "children": [
    {
     "k": "nav_s4_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s4_1",
     "label": "Stock Corrections",
     "ar": "تصحيحات المخزون",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s4_2",
     "label": "Stock Movements",
     "ar": "حركات المخزون",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s4_3",
     "label": "Stock Reservations",
     "ar": "حجوزات المخزون",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s4_4",
     "label": "Wastage",
     "ar": "الهدر",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s4_5",
     "label": "KOT Errors",
     "ar": "أخطاء أوامر المطبخ",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s4_6",
     "label": "Stock Entry",
     "ar": "قيد مخزون",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s4_7",
     "label": "Issue Authorizations",
     "ar": "تصاريح الصرف",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s4_8",
     "label": "Checklist Logs",
     "ar": "سجلات قوائم التحقق",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s4_9",
     "label": "Fulfilment Records",
     "ar": "سجلات التنفيذ",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s5",
   "label": "Finance",
   "ar": "المالية",
   "icon": "wallet",
   "children": [
    {
     "k": "nav_s5_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s5_1",
     "label": "Payment Entry",
     "ar": "تدوينات المدفوعات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s5_2",
     "label": "Journal Entry",
     "ar": "القيود اليومية",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s5_3",
     "label": "Chart of Accounts",
     "ar": "دليل الحسابات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s5_4",
     "label": "General Ledger",
     "ar": "دفتر الأستاذ العام",
     "icon": "",
     "link_type": "Report",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s6",
   "label": "Purchasing",
   "ar": "المشتريات",
   "icon": "shopping-cart",
   "children": [
    {
     "k": "nav_s6_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s6_1",
     "label": "Purchase Order",
     "ar": "أمر الشراء",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s6_2",
     "label": "Purchase Receipt",
     "ar": "إستلام المشتريات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s6_3",
     "label": "Purchase Invoice",
     "ar": "فاتورة شراء",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s6_4",
     "label": "Supplier",
     "ar": "المورد",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s6_5",
     "label": "Material Request",
     "ar": "طلب مواد",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s7",
   "label": "Staff & Shifts",
   "ar": "الموظفون والورديات",
   "icon": "users",
   "children": [
    {
     "k": "nav_s7_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s7_1",
     "label": "Employee",
     "ar": "الموظف",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s7_2",
     "label": "Attendance",
     "ar": "الحضور",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s7_3",
     "label": "Shift Assignment",
     "ar": "تعيين الوردية",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s7_4",
     "label": "Shift Type",
     "ar": "نوع الوردية",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s7_5",
     "label": "Employee Checkin",
     "ar": "تسجيل حضور الموظف",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s7_6",
     "label": "Leave Application",
     "ar": "طلب إجازة",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s8",
   "label": "AI Insights",
   "ar": "رؤى الذكاء الاصطناعي",
   "icon": "sparkles",
   "children": [
    {
     "k": "nav_s8_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s8_1",
     "label": "Insight Records",
     "ar": "سجلات الرؤى",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s8_2",
     "label": "Agent",
     "ar": "الوكيل",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s8_3",
     "label": "Agent Conversation",
     "ar": "محادثة الوكيل",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s8_4",
     "label": "Alert Settings",
     "ar": "إعدادات التنبيهات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s9",
   "label": "Analytics",
   "ar": "التحليلات",
   "icon": "chart-no-axes-combined",
   "children": [
    {
     "k": "nav_s9_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s9_1",
     "label": "Branch Manager",
     "ar": "مدير الفرع",
     "icon": "store",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s9_2",
     "label": "Menu",
     "ar": "القائمة",
     "icon": "utensils-crossed",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s9_3",
     "label": "Kitchen",
     "ar": "المطبخ",
     "icon": "chef-hat",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s9_4",
     "label": "Floor",
     "ar": "الصالة",
     "icon": "armchair",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s9_5",
     "label": "People",
     "ar": "الأفراد",
     "icon": "users",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s9_6",
     "label": "Finance",
     "ar": "المالية",
     "icon": "wallet",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s9_7",
     "label": "Quality",
     "ar": "الجودة",
     "icon": "shield-check",
     "link_type": "Workspace",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s10",
   "label": "Reports",
   "ar": "تقارير",
   "icon": "sheet",
   "children": [
    {
     "k": "nav_s10_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s10_1",
     "label": "Today's Sales",
     "ar": "مبيعات اليوم",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s10_2",
     "label": "Daywise Sales",
     "ar": "المبيعات حسب اليوم",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s10_3",
     "label": "Month Wise Sales",
     "ar": "المبيعات حسب الشهر",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s10_4",
     "label": "Item Wise Sales",
     "ar": "المبيعات حسب الصنف",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s10_5",
     "label": "Employee Sales",
     "ar": "مبيعات الموظفين",
     "icon": "",
     "link_type": "Report",
     "url": ""
    },
    {
     "k": "nav_s10_6",
     "label": "Unsettled Bills",
     "ar": "الفواتير غير المسددة",
     "icon": "",
     "link_type": "Report",
     "url": ""
    }
   ]
  },
  {
   "k": "nav_s11",
   "label": "Setup",
   "ar": "الإعدادات",
   "icon": "settings",
   "children": [
    {
     "k": "nav_s11_0",
     "label": "Overview",
     "ar": "نظرة عامّة",
     "icon": "",
     "link_type": "Workspace",
     "url": ""
    },
    {
     "k": "nav_s11_1",
     "label": "Branch",
     "ar": "فرع",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_2",
     "label": "Restaurant",
     "ar": "المطعم",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_3",
     "label": "POS Profile",
     "ar": "ملف نقاط البيع",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_4",
     "label": "Menu",
     "ar": "القائمة",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_5",
     "label": "Menu Course",
     "ar": "قسم قائمة الطعام",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_6",
     "label": "Production Unit",
     "ar": "وحدة الإنتاج",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_7",
     "label": "Report Settings",
     "ar": "إعدادات التقارير",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_8",
     "label": "Feature Flags",
     "ar": "مفاتيح الميزات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_9",
     "label": "Commission Settings",
     "ar": "إعدادات العمولات",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_10",
     "label": "AI Settings",
     "ar": "إعدادات الذكاء الاصطناعي",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_11",
     "label": "Branch Operating Schedule",
     "ar": "جدول تشغيل الفرع",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_12",
     "label": "Branch Operating Exception",
     "ar": "استثناء تشغيل الفرع",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_13",
     "label": "Production Department",
     "ar": "قسم الإنتاج",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_14",
     "label": "Ordering Device",
     "ar": "جهاز الطلب",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_15",
     "label": "Self Ordering Profile",
     "ar": "ملف الطلب الذاتي",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_16",
     "label": "Branch Stock Policy",
     "ar": "سياسة مخزون الفرع",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_17",
     "label": "Staff Discount Policy",
     "ar": "سياسة خصم الموظفين",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    },
    {
     "k": "nav_s11_18",
     "label": "Fulfilment Posting Intents",
     "ar": "نوايا ترحيل التنفيذ",
     "icon": "",
     "link_type": "DocType",
     "url": ""
    }
   ]
  }
 ],
 "pops": {
  "k": "pops_home",
  "label": "POS Operations",
  "ar": "عمليات نقاط البيع",
  "icon": "monitor",
  "link_type": "Workspace",
  "url": ""
 },
 "popsSections": [
  {
   "k": "pops_s0",
   "label": "Apps",
   "ar": "التطبيقات",
   "icon": "app-window",
   "children": [
    {
     "k": "pops_s0_0",
     "label": "Open POS",
     "ar": "فتح نقطة البيع",
     "icon": "",
     "link_type": "URL",
     "url": "/pos"
    },
    {
     "k": "pops_s0_1",
     "label": "Kitchen Display",
     "ar": "شاشة المطبخ",
     "icon": "",
     "link_type": "URL",
     "url": "/mosaic"
    },
    {
     "k": "pops_s0_2",
     "label": "URY Console",
     "ar": "لوحة URY",
     "icon": "",
     "link_type": "URL",
     "url": "/ury"
    }
   ]
  }
 ],
 "ui": {
  "Search": [
   "Search",
   "البحث"
  ],
  "Notification": [
   "Notification",
   "الإشعارات"
  ],
  "URY": [
   "URY",
   "URY"
  ],
  "Home": [
   "Home",
   "الصفحة الرئيسية"
  ]
 },
 "arSource": {
  "Home": "ury ar.csv",
  "Apps": "ury ar.csv",
  "Open POS": "ury ar.csv",
  "Kitchen Display": "ury ar.csv",
  "URY Console": "ury ar.csv",
  "Plan": "fixed label translated",
  "Overview": "ury ar.csv",
  "Sales Plans": "ury ar.csv",
  "Production Settings": "ury ar.csv",
  "Item Production Setup": "ury ar.csv",
  "Bulk Production": "ury ar.csv",
  "Operate": "ury ar.csv",
  "Orders": "fixed label translated",
  "Kitchen Orders": "ury ar.csv",
  "Tables": "ury ar.csv",
  "Rooms": "ury ar.csv",
  "Ordering Sessions": "ury ar.csv",
  "Sub POS Closing": "ury ar.csv",
  "Service Requests": "ury ar.csv",
  "Payment Terminals": "ury ar.csv",
  "Terminal Transactions": "ury ar.csv",
  "Observe": "ury ar.csv",
  "Daily P&L": "ury ar.csv",
  "Yield Checks": "ury ar.csv",
  "Food Cost & Margin": "ury ar.csv",
  "RevPASH Report": "ury ar.csv",
  "Table Turnaround Delay": "ury ar.csv",
  "Avg Per Cover": "ury ar.csv",
  "Cost Variance Snapshot": "ury ar.csv",
  "Control": "ury ar.csv",
  "Stock Corrections": "ury ar.csv",
  "Stock Movements": "ury ar.csv",
  "Stock Reservations": "ury ar.csv",
  "Wastage": "ury ar.csv",
  "KOT Errors": "ury ar.csv",
  "Stock Entry": "ury ar.csv",
  "Issue Authorizations": "ury ar.csv",
  "Checklist Logs": "ury ar.csv",
  "Fulfilment Records": "ury ar.csv",
  "Finance": "ury ar.csv",
  "Payment Entry": "ury ar.csv",
  "Journal Entry": "ury ar.csv",
  "Chart of Accounts": "ury ar.csv",
  "General Ledger": "ury ar.csv",
  "Purchasing": "ury ar.csv",
  "Purchase Order": "ury ar.csv",
  "Purchase Receipt": "ury ar.csv",
  "Purchase Invoice": "ury ar.csv",
  "Supplier": "ury ar.csv",
  "Material Request": "ury ar.csv",
  "Staff & Shifts": "ury ar.csv",
  "Employee": "ury ar.csv",
  "Attendance": "ury ar.csv",
  "Shift Assignment": "ury ar.csv",
  "Shift Type": "ury ar.csv",
  "Employee Checkin": "ury ar.csv",
  "Leave Application": "ury ar.csv",
  "AI Insights": "ury ar.csv",
  "Insight Records": "ury ar.csv",
  "Agent": "ury ar.csv",
  "Agent Conversation": "ury ar.csv",
  "Alert Settings": "ury ar.csv",
  "Analytics": "ury ar.csv",
  "Branch Manager": "ury ar.csv",
  "Menu": "fixed label translated",
  "Kitchen": "ury ar.csv",
  "Floor": "ury ar.csv",
  "People": "ury ar.csv",
  "Quality": "ury ar.csv",
  "Reports": "ury ar.csv",
  "Today's Sales": "ury ar.csv",
  "Daywise Sales": "ury ar.csv",
  "Month Wise Sales": "ury ar.csv",
  "Item Wise Sales": "ury ar.csv",
  "Employee Sales": "ury ar.csv",
  "Unsettled Bills": "ury ar.csv",
  "Setup": "fixed label translated",
  "Branch": "ury ar.csv",
  "Restaurant": "ury ar.csv",
  "POS Profile": "ury ar.csv",
  "Menu Course": "ury ar.csv",
  "Production Unit": "ury ar.csv",
  "Report Settings": "ury ar.csv",
  "Feature Flags": "ury ar.csv",
  "Commission Settings": "ury ar.csv",
  "AI Settings": "ury ar.csv",
  "Branch Operating Schedule": "ury ar.csv",
  "Branch Operating Exception": "ury ar.csv",
  "Production Department": "ury ar.csv",
  "Ordering Device": "ury ar.csv",
  "Self Ordering Profile": "ury ar.csv",
  "Branch Stock Policy": "ury ar.csv",
  "Staff Discount Policy": "ury ar.csv",
  "Fulfilment Posting Intents": "ury ar.csv",
  "POS Operations": "fixed label translated",
  "Search": "ury ar.csv",
  "Notification": "fixed label translated",
  "URY": "fixed label translated"
 },
 "icons": {
  "app-window": "<rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" /> <path d=\"M10 4v4\" /> <path d=\"M2 8h20\" /> <path d=\"M6 4v4\" />",
  "armchair": "<path d=\"M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3\" /> <path d=\"M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z\" /> <path d=\"M5 18v2\" /> <path d=\"M19 18v2\" />",
  "bell": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /> <path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />",
  "calendar-check": "<path d=\"M8 2v3\" /> <path d=\"M16 2v3\" /> <rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" /> <path d=\"M3 9h18\" /> <path d=\"m9 15 2 2 4-4\" />",
  "chart-no-axes-combined": "<path d=\"M12 16v5\" /> <path d=\"M16 14.639V21\" /> <path d=\"M20 10.656V21\" /> <path d=\"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15\" /> <path d=\"M4 18.463V21\" /> <path d=\"M8 14.656V21\" />",
  "chef-hat": "<path d=\"M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z\" /> <path d=\"M6 17h12\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "eye": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "house": "<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />",
  "menu": "<path d=\"M4 5h16\" /> <path d=\"M4 12h16\" /> <path d=\"M4 19h16\" />",
  "monitor": "<rect width=\"20\" height=\"14\" x=\"2\" y=\"3\" rx=\"2\" /> <line x1=\"8\" x2=\"16\" y1=\"21\" y2=\"21\" /> <line x1=\"12\" x2=\"12\" y1=\"17\" y2=\"21\" />",
  "panel-left-close": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" /> <path d=\"M9 3v18\" /> <path d=\"m16 15-3-3 3-3\" />",
  "search": "<path d=\"m21 21-4.34-4.34\" /> <circle cx=\"11\" cy=\"11\" r=\"8\" />",
  "settings": "<path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\" /> <circle cx=\"12\" cy=\"12\" r=\"3\" />",
  "sheet": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\" ry=\"2\" /> <line x1=\"3\" x2=\"21\" y1=\"9\" y2=\"9\" /> <line x1=\"3\" x2=\"21\" y1=\"15\" y2=\"15\" /> <line x1=\"9\" x2=\"9\" y1=\"9\" y2=\"21\" /> <line x1=\"15\" x2=\"15\" y1=\"9\" y2=\"21\" />",
  "shield-check": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /> <path d=\"m9 12 2 2 4-4\" />",
  "shopping-cart": "<path d=\"m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18\" /> <path d=\"M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25\" /> <circle cx=\"18\" cy=\"20\" r=\"2\" /> <circle cx=\"8\" cy=\"20\" r=\"2\" />",
  "sparkles": "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\" /> <path d=\"M20 2v4\" /> <path d=\"M22 4h-4\" /> <circle cx=\"4\" cy=\"20\" r=\"2\" />",
  "store": "<path d=\"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5\" /> <path d=\"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244\" /> <path d=\"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05\" />",
  "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\" /> <path d=\"M16 3.128a4 4 0 0 1 0 7.744\" /> <path d=\"M22 21v-2a4 4 0 0 0-3-3.87\" /> <circle cx=\"9\" cy=\"7\" r=\"4\" />",
  "utensils": "<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\" /> <path d=\"M7 2v20\" /> <path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\" />",
  "utensils-crossed": "<path d=\"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8\" /> <path d=\"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7\" /> <path d=\"m2.1 21.8 6.4-6.3\" /> <path d=\"m19 5-7 7\" />",
  "wallet": "<path d=\"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1\" /> <path d=\"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4\" />",
  "x": "<path d=\"M18 6 6 18\" /> <path d=\"m6 6 12 12\" />"
 },
 "logo": "data:image/png;base64,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"
};

// ---- helpers (markup mirrors frappe/public/js/frappe/ui/sidebar/{sidebar,sidebar_item,sidebar_header}.html and dock.js) ----
const esc = (s) => String(s).replace(/&amp;/g, '&').replace(/&/g, '&amp;').replace(/</g, '&lt;');
export const NAV_SPRITE_ICONS = Object.keys(D.icons);
// One hidden sprite per document (frappe puts it in <svg id="frappe-symbols">); screens that compose several parts pass sprite:false to all but the first.
export const sprite = () => `<svg class="icon ury-desk-sprite" aria-hidden="true" style="display:none" xmlns="http://www.w3.org/2000/svg">${Object.entries(D.icons).map(([n, p]) => `<symbol viewBox="0 0 24 24" id="icon-${n}">${p}</symbol>`).join('')}</svg>`;
const icon = (name, size = 'sm', cls = 'current-color', stroke = '') => `<svg class="icon ${cls} icon-${size}" stroke="${stroke || 'currentColor'}" style="" aria-hidden="true"><use class="" href="#icon-${name}"${stroke ? ` stroke="${stroke}"` : ''}></use></svg>`;
const rail = (name) => `<svg class="icon  icon-rail" style="" aria-hidden="true"><use class="" href="#icon-${name}"></use></svg>`;

export const NAV_ACTIVE_DEFAULT = 'Orders';
// All visible strings are slots: slot key -> English sample (and Arabic for rtlValues).
const allItems = () => [D.home, ...D.sections.flatMap((s) => [s, ...s.children]), D.pops, ...D.popsSections.flatMap((s) => [s, ...s.children])];
export const navSlots = () => ({
  ...Object.fromEntries(allItems().map((i) => [i.k, esc(i.label)])),
  nav_title: 'URY', nav_search: 'Search', nav_notification: 'Notification', nav_notif_count: '6',
  nav_user_name: 'Administrator', nav_user_email: 'admin@example.com', nav_crumb: 'Orders', nav_navbar_search: 'Search or type a command', nav_navbar_shortcut: 'Ctrl+K',
  nav_dock_ury: 'URY', nav_dock_analytics: 'Analytics', nav_dock_all_apps: 'All apps',
});
export const navRtl = () => ({
  ...Object.fromEntries(allItems().map((i) => [i.k, esc(i.ar)])),
  nav_title: 'URY', nav_search: D.ui.Search[1], nav_notification: D.ui.Notification[1], nav_notif_count: '٦',
  nav_user_name: 'المسؤول', nav_user_email: 'admin@example.com', nav_crumb: esc(D.sections[2].children[1].ar), nav_navbar_search: 'ابحث أو اكتب أمراً', nav_navbar_shortcut: 'Ctrl+K',
  nav_dock_ury: 'URY', nav_dock_analytics: 'التحليلات', nav_dock_all_apps: 'كل التطبيقات',
});
// slot objects for spec.slots / spec.rtlValues (plain strings; types default to text)
export const NAV_SLOTS = navSlots();
export const NAV_RTL = navRtl();
export const sidebarOrder = () => D.sections.map((s) => s.label);

const avatar = (v, cls = 'avatar-medium') => `<span class="avatar ${cls}"><div class="avatar-frame standard-image" style="background-color: var(--dark-green-avatar-bg); color: var(--dark-green-avatar-color)">${v.nav_user_name_initials}</div></span>`;

const link = (it, v, { active = false, extra = '' } = {}) => {
  const isUrl = it.link_type === 'URL';
  const ico = it.icon ? `<span class="sidebar-item-icon" item-icon="${it.icon}">${icon(it.icon)}</span>` : '';
  return `<div class="sidebar-item-container  " item-name="${esc(it.label)}" data-id="${esc(it.label)}">
<div class="standard-sidebar-item ${active ? 'active-sidebar' : ''}"><a href="#" target="${isUrl ? '_blank' : ''}" class="item-anchor" data-link-type="${it.link_type}"${extra}>${ico}<span class="sidebar-item-label">${v[it.k]}</span><div class="sidebar-item-control"></div></a></div>
<div class="sidebar-child-item nested-container"></div></div>`;
};
const group = (s, v, { open = false, active = '' } = {}) => `<div class="sidebar-item-container  section-item" item-name="${esc(s.label)}" data-id="${esc(s.label)}">
<div class="standard-sidebar-item indent"><a class="item-anchor" data-link-type="${s.link_type || 'DocType'}"><span class="sidebar-item-icon" item-icon="${s.icon}">${icon(s.icon)}</span><span class="sidebar-item-label">${v[s.k]}</span><div class="sidebar-item-control"><button class="btn-reset drop-icon" data-state="${open ? 'opened' : 'closed'}">${icon(open ? 'chevron-down' : 'chevron-right', 'sm', '', '#7c7c7c')}</button></div></a></div>
<div class="sidebar-child-item nested-container${open ? '' : ' hidden'}">${s.children.map((c) => link(c, v, { active: c.label === active })).join('')}</div></div>`;

// opts: collapsed, open (section label or null), active (row label), bandOnly, id, edge ('hover'), drawer, sprite, pops (POS Operations sidebar), packed (inside a pinned-dock shell)
export const sidebar = (v, o = {}) => {
  const pops = !!o.pops; const sections = pops ? D.popsSections : D.sections; const home = pops ? D.pops : D.home;
  const open = o.open === undefined ? (pops ? null : 'Operate') : o.open; const active = o.active === undefined ? (pops ? D.pops.label : NAV_ACTIVE_DEFAULT) : o.active;
  const items = [link(home, v, { active: home.label === active }), ...sections.map((s) => group(s, v, { open: s.label === open, active }))].join('');
  const band = `<div class="standard-items-band"><div class="navbar-modal-search-mobile" item-name="Search" data-id="Search"><div class="standard-sidebar-item "><a class="item-anchor" data-link-type=""><span class="sidebar-item-icon" item-icon="search">${icon('search')}</span><span class="sidebar-item-label">${v.nav_search}</span><div class="sidebar-item-control"></div></a></div><div class="sidebar-child-item nested-container"></div></div><div class="sidebar-notification" item-name="Notification" data-id="Notification"><div class="standard-sidebar-item "><a class="item-anchor" data-link-type=""><span class="sidebar-item-icon" item-icon="bell">${icon('bell')}</span><span class="sidebar-item-label">${v.nav_notification}</span><span class="sidebar-item-suffix"><span class="notification-count" aria-live="polite">${v.nav_notif_count}</span></span><div class="sidebar-item-control"></div></a></div><div class="sidebar-child-item nested-container"></div></div></div>`;
  const hov = o.edge === 'hover';
  const inner = `<div class="body-sidebar-container ury-desk ury-desk-sidebar${o.collapsed ? '' : ' expanded'}${o.drawer ? ' ury-desk-drawer-panel' : ''}" data-ui="${o.wrap || o.drawer ? 'ury-desk-sidebar.container' : (o.id || 'ury-desk-sidebar')}">
<div class="body-sidebar" data-ui="ury-desk-sidebar.panel"><a class="sidebar-header shell-header" style="text-decoration: none;" aria-haspopup="menu" aria-expanded="false" data-ui="ury-desk-sidebar.header"><div class="header-logo"><img src="${D.logo}" alt=""></div><div class="title-container"><div class="sidebar-item-label header-title" data-name-style="">${pops ? v.pops_home : v.nav_title}</div></div><button class="btn-reset drop-icon" aria-label="Sidebar Menu">${icon('chevron-down', 'sm', '')}</button></a>
${band}
<div class="body-sidebar-top"><div class="sidebar-items" data-ui="ury-desk-sidebar.items">${items}</div></div>
<div class="body-sidebar-cards"></div>
<div class="body-sidebar-bottom"><div class="promotional-banners" style="display: none;"></div><div class="nav-item dropdown-navbar-user dropdown-mobile mt-3" aria-haspopup="menu" aria-expanded="false"><a class="align-center btn-reset flex nav-link sidebar-user-button" style="width: 100%; min-height: 40px;" aria-label="User Menu" data-ui="ury-desk-sidebar.user"><div> ${avatar(v)} </div><div class="avatar-name-email overflow-hidden" style="margin-left: 8px;"><span class="d-block text-truncate">${v.nav_user_name}</span><span class="d-block text-truncate">${v.nav_user_email}</span></div></a></div></div></div>
<div class="sidebar-edge${hov ? ' is-hover' : ''}" aria-hidden="true" data-ui="ury-desk-sidebar.edge"></div>
<button class="btn-reset sidebar-collapse-arrow${hov ? ' is-visible' : ''}" type="button" aria-label="Collapse sidebar" data-ui="ury-desk-sidebar.arrow">${icon('chevron-left', 'xs')}</button>
<div class="overlay" style="z-index: 1021;"></div></div>`;
  if (o.drawer) return (o.sprite === false ? '' : sprite()) + `<div class="ury-desk ury-desk-drawer" style="width:375px;height:812px;--ury-desk-h:812px" data-ui="${o.id || 'ury-desk-sidebar'}"><div class="ury-desk-drawer-page">${pageHead(v)}</div>${inner}</div>`;
  const wrapped = o.wrap ? `<div class="ury-desk ury-desk-sidebar-stage" data-ui="${o.id || 'ury-desk-sidebar'}">${inner}</div>` : inner;
  return (o.sprite === false ? '' : sprite()) + wrapped;
};

// Dock (frappe.ui.Dock.make): URY dock rows are ury/dock/ury/ury.json -> URY (utensils, Sidebar URY) and Analytics (chart-no-axes-combined, Workspace).
// opts: mode 'pinned' | 'floating', active 'URY' | 'Analytics', tooltip (show the plain tooltip for the second tile), sprite
export const dock = (v, o = {}) => {
  const pinned = (o.mode || 'pinned') === 'pinned'; const active = o.active || 'URY';
  const tile = (name, lab, ico, hov) => `<button class="dock-item ${name === active ? 'active' : ''}${hov ? ' is-hover' : ''}" aria-label="${lab}"${name === active ? ' aria-current="page"' : ''} data-ui="ury-desk-dock.tile-${name.toLowerCase()}"><span class="dock-item-icon">${rail(ico)}</span><span class="dock-item-label">${lab}</span></button>`;
  const util = pinned ? `<div class="dock-utilities"><button class="dock-item navbar-modal-search-mobile" aria-label="${v.nav_search}" data-ui="ury-desk-dock.search"><span class="dock-item-icon">${icon('search')}</span></button><button class="dock-item sidebar-notification" aria-label="${v.nav_notification}" data-ui="ury-desk-dock.bell"><span class="dock-item-icon">${icon('bell')}</span><span class="notification-count dock-item-dot " aria-live="polite"></span></button></div>` : '<div class="dock-utilities"></div>';
  const user = `<div class="dock-user" aria-haspopup="menu" aria-expanded="false"><button class="dock-item dock-user-button" aria-label="User Menu" data-ui="ury-desk-dock.user">${avatar(v)}</button></div>`;
  const body = `<div class="dock ury-desk ury-desk-dock ury-desk-dock--${pinned ? 'pinned dock-owns-utilities' : 'floating'}" id="desk-dock" role="navigation" aria-label="Apps" aria-hidden="false" data-ui="${o.tooltip ? 'ury-desk-dock.tray' : (o.id || 'ury-desk-dock')}">
<div class="dock-logo"><a class="shell-header" href="#" aria-label="${v.nav_dock_all_apps}" data-ui="ury-desk-dock.logo"><div class="header-logo"><img src="${D.logo}" alt=""></div><div class="title-container"><div class="header-title">${v.nav_title}</div></div></a></div>
${util}
<div class="dock-items">${tile('URY', v.nav_dock_ury, 'utensils')}${tile('Analytics', v.nav_dock_analytics, 'chart-no-axes-combined', !!o.tooltip)}</div>
${user}</div>`;
  const tip = o.tooltip ? `<div class="es-tooltip es-tooltip--plain ury-desk-tooltip" role="tooltip" data-side="right" data-state="open" data-ui="ury-desk-dock.tooltip">${v.nav_dock_analytics}<div class="es-tooltip__arrow"></div></div>` : '';
  const out = o.tooltip ? `<div class="ury-desk ury-desk-dock-stage" data-ui="${o.id || 'ury-desk-dock'}">${body}${tip}</div>` : body;
  return (o.sprite === false ? '' : sprite()) + out;
};

const navbar = (v) => `<header class="desktop-navbar navbar-expand navbar-container" role="navigation" data-ui="ury-desk-shell.navbar"><div class="search-widget-wrapper input-group search-bar"><button id="search-widget-button" class="btn-reset search-widget-button" title="Search"><span class="search-widget-icon"><svg class="icon icon-sm"><use href="#icon-search"></use></svg> ${v.nav_navbar_search}</span><span class="search-widget-shortcut">${v.nav_navbar_shortcut}</span></button></div><div class="flex" style="gap:16px; align-items: center;"><div class="desktop-notifications"><button class="btn-reset nav-link text-muted desktop-notification-icon" aria-label="Notifications" aria-haspopup="dialog" aria-expanded="false"><svg class="icon icon-md" aria-hidden="true"><use href="#icon-bell"></use></svg><span class="notification-count" aria-live="polite">${v.nav_notif_count}</span></button></div><div class="desktop-avatar" aria-haspopup="menu" aria-expanded="false">${avatar(v)}</div></div></header>`;
const pageHead = (v) => `<div class="content page-container"><div class="page-head flex" data-ui="ury-desk-shell.page-head"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between"><div class="page-title"><button class="btn-reset sidebar-toggle-btn navbar-brand"><svg class="icon icon-md sidebar-toggle-placeholder"><use href="#icon-menu"></use></svg><span class="sidebar-toggle-icon"><svg class="icon icon-md"><use href="#icon-panel-left-close"></use></svg></span></button><div class="flex title-area ellipsis"><nav class="es-breadcrumbs navbar-breadcrumbs" aria-label="Breadcrumbs"><ol><li><span class="es-breadcrumbs__item" aria-current="page"><span class="es-breadcrumbs__label">${v.nav_crumb}</span></span></li></ol></nav></div></div><div class="align-center flex standard-items-section"></div></div></div></div></div>`;

// deskShell(active, mainHtml): 1440x900 desk shell for T25-T27 screens. active = sidebar row label (string) or {row, section, dock}; mainHtml goes under the page head.
// Include NAV_SLOTS / NAV_RTL in the screen spec's slots/rtlValues (the shell reads those keys).
export const deskShell = (active, mainHtml = '', v = new Proxy({}, { get: (_, k) => `{{${String(k)}}}` }), o = {}) => {
  const a = typeof active === 'string' ? { row: active } : (active || {}); const row = a.row === undefined ? NAV_ACTIVE_DEFAULT : a.row;
  const sec = a.section !== undefined ? a.section : (D.sections.find((s) => s.children.some((c) => c.label === row)) || {}).label || null;
  const inner = `${sprite()}<div class="ury-desk ury-desk-shell-row">${dock(v, { mode: 'pinned', active: a.dock || 'URY', sprite: false })}${sidebar(v, { open: sec, active: row, sprite: false })}<div class="main-section ury-desk-main"><div class="ury-desk-main-col">${navbar(v)}${pageHead(v)}<div class="page-body ury-desk-page-body">${mainHtml}</div></div></div></div>`;
  return screen(o.width || 1440, o.height || 900, inner, o.id === undefined ? 'ury-desk-shell' : o.id, 'ury-desk ury-desk-shell');
};
