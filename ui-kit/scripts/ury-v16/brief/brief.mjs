// URY Brief (brief_app, ury-erp/version-16 @100c43fe2e) markup helpers. Class lists mirror brief_app/src/{components,chat,call,settings}/*.tsx.
// Every function takes v (slot proxy: v.key -> {{key}}) and a data-ui id so screens can embed parts under their own id.
import { money, screen } from '../lib.mjs';

// ---- Material fill icons (brief_app/src/components/Icons.tsx), viewBox 24 ----
const P = {
  mic: 'M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11z',
  send: 'M2.01 21 23 12 2.01 3 2 10l15 2-15 2z',
  play: 'M8 5v14l11-7z',
  phone: 'M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.4 11.4 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z',
  kebab: '<circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z',
  close: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  tick: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  dtick: 'M18 7l-1.41-1.41-6.34 6.34 1.41 1.41zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12zM.41 13.41 6 19l1.41-1.41L1.83 12z',
  settings: 'M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.61-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.48-.41h-3.84a.5.5 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96a.5.5 0 0 0-.61.22L2.74 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32c.12.22.37.29.61.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.49 0 .61-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z',
  install: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
  logout: 'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H4V5z',
  up: 'M7.41 15.41 12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  down: 'M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z',
  search: 'M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 14 15.5l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z',
  sparkle: 'M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z',
  // tab icons (Brief / Ask / Call tabs, brief_app e2e: tabs ["Brief","Ask","Call"])
  brief: 'M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14v11z',
  ask: 'M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z',
};
export const mi = (n, size = 24, cls = '') => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${P[n].startsWith('<') ? P[n] : `<path d="${P[n]}"/>`}</svg>`;

// ---- copy: [English, Arabic]. Fixed UI labels are translated; no Arabic exists in brief_app (no locale files). ----
const D = {
  // top bar
  tb_title: ['Al Noor Restaurant', 'مطعم النور'], tb_sub: ['Updated 09:41', 'آخر تحديث 09:41'], tb_initials: ['SE', 'س'],
  tb_call: ['Call', 'اتصال'], tb_more: ['More options', 'المزيد'], tb_account: ['Account menu', 'قائمة الحساب'],
  m_appearance: ['Appearance', 'المظهر'], m_auto: ['Auto', 'تلقائي'], m_light: ['Light', 'فاتح'], m_dark: ['Dark', 'داكن'],
  m_settings: ['Settings', 'الإعدادات'], m_whatsapp: ['WhatsApp', 'واتساب'], m_install: ['Add to home screen', 'إضافة إلى الشاشة الرئيسية'], m_signout: ['Sign out', 'تسجيل الخروج'],
  // tab bar
  t_brief: ['Brief', 'الملخص'], t_ask: ['Ask', 'اسأل'], t_call: ['Call', 'اتصال'],
  // hero + tiles
  h_lbl: ['Net sales · Yesterday', 'صافي المبيعات · أمس'], h_delta: ['+12.4%', '+12.4%'],
  k_orders: ['Orders', 'الطلبات'], v_orders: ['142', '142'], d_orders: ['vs 128 before', 'مقابل 128 سابقاً'],
  k_avg: ['Avg check', 'متوسط الفاتورة'], k_covers: ['Covers', 'عدد الضيوف'], v_covers: ['236', '236'], d_covers: ['118 bills', '118 فاتورة'],
  k_spc: ['Spend per cover', 'الإنفاق لكل ضيف'], k_prep: ['Avg prep time', 'متوسط وقت التحضير'], v_prep: ['11.5 min', '11.5 دقيقة'], d_prep: ['p90 18 min', 'p90 18 دقيقة'],
  sec_story: ['Today’s story', 'قصة اليوم'], sec_recent: ['Recent questions', 'الأسئلة الأخيرة'], see_all: ['See all', 'عرض الكل'],
  // feed card
  f_title: ['Sales, last 7 days', 'المبيعات خلال 7 أيام'], f_head: ['Sales are up on last week, led by weekend dinner.', 'المبيعات أعلى من الأسبوع الماضي بفضل عشاء نهاية الأسبوع.'],
  f_total: ['Total', 'الإجمالي'], f_orders: ['Orders', 'الطلبات'], f_vs: ['vs before', 'مقارنة بالسابق'], f_vsv: ['+12.4%', '+12.4%'], f_ordv: ['142', '142'],
  f_partial_b: ['Partial data:', 'بيانات جزئية:'], f_partial: [' some days or values are missing.', ' بعض الأيام أو القيم ناقصة.'],
  f_ask: ['Ask about this', 'اسأل عن هذا'], f_dash: ['Dashboard ›', 'لوحة المعلومات ‹'],
  f_unavail_b: ['Not recorded yet.', 'لم يُسجَّل بعد.'],
  f_top_t: ['Top and slowest dishes', 'الأطباق الأكثر والأقل مبيعاً'], f_top_h: ['What guests ordered most and least yesterday.', 'ما طلبه الضيوف أكثر وأقل أمس.'],
  f_top: ['Top sellers', 'الأكثر مبيعاً'], f_slow: ['Slowest sellers', 'الأقل مبيعاً'],
  i1: ['Chicken Mandi', 'مندي دجاج'], i2: ['Grilled Hammour', 'هامور مشوي'], i3: ['Lamb Ouzi', 'أوزي لحم'],
  s1: ['Fattoush Salad', 'سلطة فتوش'], s2: ['Lentil Soup', 'شوربة عدس'], s3: ['Kunafa', 'كنافة'],
  g_title: ['Key numbers', 'الأرقام الرئيسية'], g_head: ['How the day compares with the one before.', 'مقارنة اليوم باليوم السابق.'],
  // chats sheet
  c_title: ['All questions', 'جميع الأسئلة'], c_close: ['Close', 'إغلاق'], c_search: ['Search questions', 'ابحث في الأسئلة'], c_more: ['More', 'المزيد'],
  r1_t: ['How were sales yesterday?', 'كيف كانت المبيعات أمس؟'], r1_p: ['Thinking…', 'جارٍ التفكير…'], r1_w: ['09:41', '09:41'],
  r2_t: ['Which dishes should I push?', 'أي الأطباق يجب أن أروّج لها؟'], r2_p: ['Chicken Mandi and Grilled Hammour are your steadiest sellers.', 'مندي الدجاج والهامور المشوي هما الأكثر ثباتاً في المبيعات.'], r2_w: ['Yesterday', 'أمس'],
  r3_t: ['Voice message', 'رسالة صوتية'], r3_p: ['You: How is kitchen prep time?', 'أنت: كيف هو وقت تحضير المطبخ؟'], r3_w: ['3 days ago', 'قبل 3 أيام'],
  r4_t: ['How are covers trending?', 'كيف يتجه عدد الضيوف؟'], r4_p: ['Covers rose 8% over the last 7 days.', 'ارتفع عدد الضيوف 8% خلال آخر 7 أيام.'], r4_w: ['12 Nov', '12 نوفمبر'],
  // dock
  dk_chip1: ['How are we doing?', 'كيف حالنا؟'], dk_chip2: ['Which dishes are slowest?', 'ما أبطأ الأطباق مبيعاً؟'], dk_chip3: ['How were sales yesterday?', 'كيف كانت المبيعات أمس؟'],
  dk_ph: ['Ask about today…', 'اسأل عن اليوم…'], dk_mic: ['Voice message', 'رسالة صوتية'], dk_call: ['Call', 'اتصال'],
  // chat
  ch_title: ['How were sales yesterday?', 'كيف كانت المبيعات أمس؟'], ch_back: ['Back', 'رجوع'], ch_day: ['Today', 'اليوم'],
  ch_u1: ['How were sales yesterday?', 'كيف كانت المبيعات أمس؟'], ch_u1t: ['09:40', '09:40'],
  ch_a1: ['Net sales were up 12.4% on the day before. Here is the detail.', 'ارتفع صافي المبيعات 12.4% عن اليوم السابق. وهذه التفاصيل.'], ch_a1t: ['09:41', '09:41'],
  ch_voice: ['Voice message', 'رسالة صوتية'], ch_u2: ['Which dishes sold best?', 'ما أكثر الأطباق مبيعاً؟'], ch_u2t: ['09:42', '09:42'],
  ch_a2: ['Chicken Mandi led the day.', 'تصدّر مندي الدجاج اليوم.'], ch_a2t: ['09:42', '09:42'],
  ch_ph: ['Ask a question', 'اطرح سؤالاً'], ch_rec: ['Record a voice message', 'تسجيل رسالة صوتية'], ch_send: ['Send message', 'إرسال'],
  ch_cancel: ['Cancel recording', 'إلغاء التسجيل'], ch_sendv: ['Send voice message', 'إرسال رسالة صوتية'], ch_timer: ['0:07', '0:07'],
  ch_play: ['Play reply', 'تشغيل الرد'],
  ch_intro: ['Ask about your restaurant', 'اسأل عن مطعمك'], ch_intro_s: ['Type or speak in English, Hindi, Arabic or Malayalam.', 'اكتب أو تحدث بالإنجليزية أو الهندية أو العربية أو المالايالامية.'],
  ch_st1: ['How were sales yesterday?', 'كيف كانت المبيعات أمس؟'], ch_st2: ['Which dishes should I push?', 'أي الأطباق يجب أن أروّج لها؟'],
  kc_title: ['Yesterday', 'أمس'], kc_sub: ['Net sales and orders', 'صافي المبيعات والطلبات'], kc_l1: ['Net sales', 'صافي المبيعات'], kc_l2: ['Orders', 'الطلبات'], kc_v2: ['142', '142'], kc_d1: ['+12.4%', '+12.4%'], kc_d2: ['+11%', '+11%'],
  kc_link: ['Open dashboard', 'فتح لوحة المعلومات'],
  bc_title: ['Top dishes', 'أفضل الأطباق'], bc_note: ['Composed by the assistant from your data. Check the dashboard to confirm.', 'أعدّه المساعد من بياناتك. راجع لوحة المعلومات للتأكد.'],
  // call
  cl_back: ['Back to chat', 'العودة إلى المحادثة'], cl_left: ['9:12 left', 'متبقي 9:12'], cl_name: ['Brief', 'الملخص'], cl_orb: ['B', 'م'],
  cl_idle: ['Tap to talk', 'اضغط للتحدث'], cl_hint: ['Voice · up to 10 min', 'صوت · حتى 10 دقائق'], cl_listen: ['Listening', 'أستمع'], cl_speak: ['Speaking', 'يتحدث'], cl_muted: ['You’re muted', 'الميكروفون مكتوم'],
  cl_fail: ['Couldn’t connect', 'تعذّر الاتصال'], cl_fail_d: ['Check your connection.', 'تحقق من اتصالك.'], cl_end_s: ['Call ended', 'انتهت المكالمة'],
  cl_time: ['01:48', '01:48'], cl_you: ['You: ', 'أنت: '], cl_line1: ['How were sales yesterday?', 'كيف كانت المبيعات أمس؟'], cl_line2: ['Net sales were up 12.4% on the day before.', 'ارتفع صافي المبيعات 12.4% عن اليوم السابق.'],
  cl_mute: ['Mute', 'كتم'], cl_unmute: ['Unmute', 'إلغاء الكتم'], cl_end: ['End', 'إنهاء'], cl_call: ['Call', 'اتصال'], cl_again: ['Call again', 'اتصل مجدداً'], cl_retry: ['Try again', 'حاول مجدداً'],
  // settings
  s_title: ['Settings', 'الإعدادات'], s_close: ['Close', 'إغلاق'], s_who: ['Signed in as owner@example.com', 'تم تسجيل الدخول باسم owner@example.com'], s_ini: ['OW', 'OW'],
  s_theme: ['Appearance', 'المظهر'], s_theme_v: ['Automatic (device setting)', 'تلقائي (إعداد الجهاز)'],
  s_lang: ['Language for chat and calls', 'لغة المحادثة والمكالمات'], s_lang_v: ['Automatic (device language)', 'تلقائي (لغة الجهاز)'],
  s_read: ['Show a play button on replies', 'إظهار زر تشغيل على الردود'],
};
// money slots (typed, reformatted per locale by tools/render.mjs)
export const M = {
  h_big: money(18420), v_avg: money(130), v_spc: money(78),
  f_totalv: money(18420),
  p1: money(4280), p2: money(3150), p3: money(2760), q1: money(120), q2: money(210), q3: money(340),
  kc_v1: money(18420),
};
const keysOf = (...ks) => Object.fromEntries(ks.map((k) => [k, D[k][0]]));
export const en = (...ks) => ({ ...keysOf(...ks.filter((k) => D[k])), ...Object.fromEntries(ks.filter((k) => M[k]).map((k) => [k, M[k]])) });
export const ar = (...ks) => Object.fromEntries(ks.filter((k) => D[k]).map((k) => [k, D[k][1]]));
export const KEYS = {
  menu: ['m_appearance', 'm_auto', 'm_light', 'm_dark', 'm_settings', 'm_whatsapp', 'm_install', 'm_signout'],
  topbar: ['tb_title', 'tb_sub', 'tb_initials', 'tb_call', 'tb_more', 'tb_account'],
  tabbar: ['t_brief', 't_ask', 't_call'],
  tiles: ['k_orders', 'v_orders', 'd_orders', 'k_avg', 'v_avg', 'k_covers', 'v_covers', 'd_covers', 'k_spc', 'v_spc', 'k_prep', 'v_prep', 'd_prep'],
  hero: ['h_lbl', 'h_big', 'h_delta'],
  fcard: ['f_title', 'f_head', 'f_total', 'f_totalv', 'f_orders', 'f_ordv', 'f_vs', 'f_vsv', 'f_partial_b', 'f_partial', 'f_ask', 'f_dash', 'f_unavail_b'],
  top: ['f_top_t', 'f_top_h', 'f_top', 'f_slow', 'i1', 'i2', 'i3', 's1', 's2', 's3', 'p1', 'p2', 'p3', 'q1', 'q2', 'q3'],
  grid: ['g_title', 'g_head'],
  dock: ['dk_chip1', 'dk_chip2', 'dk_chip3', 'dk_ph', 'dk_mic', 'dk_call'],
  rows: ['r1_t', 'r1_p', 'r1_w', 'r2_t', 'r2_p', 'r2_w', 'r3_t', 'r3_p', 'r3_w', 'r4_t', 'r4_p', 'r4_w', 'c_more'],
  chats: ['c_title', 'c_close', 'c_search'],
  chat: ['ch_title', 'ch_back', 'ch_day', 'ch_u1', 'ch_u1t', 'ch_a1', 'ch_a1t', 'ch_voice', 'ch_u2', 'ch_u2t', 'ch_a2', 'ch_a2t', 'ch_ph', 'ch_rec', 'ch_send', 'ch_cancel', 'ch_sendv', 'ch_timer', 'ch_play', 'ch_intro', 'ch_intro_s', 'ch_st1', 'ch_st2',
    'kc_title', 'kc_sub', 'kc_l1', 'kc_l2', 'kc_v1', 'kc_v2', 'kc_d1', 'kc_d2', 'kc_link', 'bc_title', 'bc_note', 'sec_story'].filter((k) => k !== 'sec_story'),
  call: ['cl_back', 'cl_left', 'cl_name', 'cl_orb', 'cl_idle', 'cl_hint', 'cl_listen', 'cl_speak', 'cl_muted', 'cl_fail', 'cl_fail_d', 'cl_end_s', 'cl_time', 'cl_you', 'cl_line1', 'cl_line2', 'cl_mute', 'cl_unmute', 'cl_end', 'cl_call', 'cl_again', 'cl_retry'],
  settings: ['s_title', 's_close', 's_who', 's_ini', 's_theme', 's_theme_v', 's_lang', 's_lang_v', 's_read'],
  story: ['sec_story', 'sec_recent', 'see_all'],
};
export const KEYS_ALL = (...groups) => groups.flatMap((g) => KEYS[g]);

const B = (ui, extra) => `data-ui="${ui}${extra ? '.' + extra : ''}"`;

// ---- Top bar (components/TopBar.tsx; spec: 56px, padding 0 8 0 16) ----
export const menu = (v, ui) => `<div class="menu" role="menu" ${B(ui, 'menu')}>
<div class="menu-theme" role="group"><p class="menu-lbl">${v.m_appearance}</p><div class="seg"><button type="button" role="menuitemradio" aria-pressed="true">${v.m_auto}</button><button type="button" role="menuitemradio" aria-pressed="false">${v.m_light}</button><button type="button" role="menuitemradio" aria-pressed="false">${v.m_dark}</button></div></div>
<button type="button" role="menuitem" ${B(ui, 'menu-item')}>${mi('settings', 22)}${v.m_settings}</button>
<button type="button" role="menuitem" ${B(ui, 'menu-item')}>${mi('sparkle', 22)}${v.m_whatsapp}</button>
<button type="button" role="menuitem" ${B(ui, 'menu-item')}>${mi('install', 22)}${v.m_install}</button>
<button type="button" role="menuitem" class="danger" ${B(ui, 'menu-item')}>${mi('logout', 22)}${v.m_signout}</button></div>`;
export const topbar = (v, ui, p = {}) => `<header class="topbar${p.avatar ? ' topbar--home' : ''}" ${B(ui)}>
<div class="topbar-title"><h1 dir="auto">${v.tb_title}</h1><p class="topbar-sub">${v.tb_sub}</p></div>
${p.avatar ? `<div class="topbar-menu"><button type="button" class="avatar" aria-label="${v.tb_account}" aria-haspopup="menu" aria-expanded="${!!p.open}" ${B(ui, 'avatar')}>${v.tb_initials}</button>${p.open ? menu(v, ui) : ''}</div>`
  : `<button type="button" class="icon-btn" aria-label="${v.tb_call}" ${B(ui, 'call')}>${mi('phone', 24)}</button><div class="topbar-menu"><button type="button" class="icon-btn" aria-label="${v.tb_more}" aria-haspopup="menu" aria-expanded="${!!p.open}" ${B(ui, 'kebab')}>${mi('kebab', 24)}</button>${p.open ? menu(v, ui) : ''}</div>`}
</header>`;

// ---- Tab bar (styles.css .tabs): Brief / Ask / Call ----
export const tabbar = (v, ui, p = {}) => `<nav class="tabs" aria-label="Tabs" ${B(ui)}>${[['brief', 't_brief'], ['ask', 't_ask'], ['call', 't_call']].map(([ic, k]) => `<button type="button"${p.active === ic ? ' aria-current="page"' : ''} ${B(ui, 'tab-' + ic)}><span class="tab-ico">${mi({ brief: 'sparkle', ask: 'send', call: 'phone' }[ic], 24)}</span><span class="tab-label">${v[k]}</span></button>`).join('')}</nav>`;

// ---- Charts (components/Charts.tsx) ----
export const spark = (pts = [38, 52, 44, 61, 57, 74, 82]) => {
  const w = 300, h = 100, pad = 8, min = Math.min(...pts), max = Math.max(...pts), span = max - min || 1;
  const xy = pts.map((x, i) => [pad + (i * (w - 2 * pad)) / (pts.length - 1), h - pad - ((x - min) / span) * (h - 2 * pad)]);
  const l = xy[xy.length - 1];
  return `<div class="spark-wrap"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img"><polyline points="${xy.map((q) => q.map((n) => n.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="hsl(var(--chart-1))" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="${l[0]}" cy="${l[1]}" r="5" fill="hsl(var(--chart-1))"/></svg></div>`;
};
export const bars = (items, ranked) => `<ul class="bars">${items.map(([label, amt, pct], i) => `<li><span class="bar-label">${ranked ? `<b class="bar-rank">${i + 1}</b>` : ''}${label}</span><span class="bar-amt">${amt}</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="width:${pct}%"></span></span></li>`).join('')}</ul>`;

// ---- Feed card (components/FeedCard.tsx) ----
export const tile = (k, val, d) => `<div class="tile"><span class="k">${k}</span><span class="v">${val}</span>${d ? `<span class="d">${d}</span>` : ''}</div>`;
export const tiles = (v, cls = '') => `<section class="grid${cls}" aria-label="Key numbers">${tile(v.k_orders, v.v_orders, v.d_orders)}${tile(v.k_avg, v.v_avg)}${tile(v.k_covers, v.v_covers, v.d_covers)}${tile(v.k_spc, v.v_spc)}${tile(v.k_prep, v.v_prep, v.d_prep)}</section>`;
export const acts = (v) => `<div class="acts"><button type="button" class="tonal">${v.f_ask}</button><button type="button" class="quiet">${v.f_dash}</button></div>`;
export const facts = (v) => `<div class="facts"><div class="fact"><b>${v.f_totalv}</b><span>${v.f_total}</span></div><div class="fact"><b>${v.f_ordv}</b><span>${v.f_orders}</span></div><div class="fact"><b>${v.f_vsv}</b><span>${v.f_vs}</span></div></div>`;
export const fcard = (v, ui, p = {}) => {
  const kind = p.kind || 'spark';
  const head = kind === 'top' ? `<h3 dir="auto">${v.f_top_t}</h3><p class="sub" dir="auto">${v.f_top_h}</p>` : kind === 'grid' ? `<h3 dir="auto">${v.g_title}</h3><p class="sub" dir="auto">${v.g_head}</p>` : `<h3 dir="auto">${v.f_title}</h3><p class="sub" dir="auto">${v.f_head}</p>`;
  let body = '';
  if (kind === 'spark') body = spark() + facts(v);
  else if (kind === 'top') body = `<p class="sub">${v.f_top}</p>${bars([[v.i1, v.p1, 100], [v.i2, v.p2, 74], [v.i3, v.p3, 64]])}<p class="sub">${v.f_slow}</p>${bars([[v.s1, v.q1, 100], [v.s2, v.q2, 62], [v.s3, v.q3, 35]])}`;
  else if (kind === 'slow') body = `<p class="sub">${v.f_slow}</p>${bars([[v.s1, v.q1, 100], [v.s2, v.q2, 62], [v.s3, v.q3, 35]], true)}`;
  else if (kind === 'grid') body = tiles(v, ' grid--auto');
  else if (kind === 'unavailable') body = `<p class="dq" dir="auto"><b>${v.f_unavail_b}</b></p>`;
  return `<article class="fcard" ${B(ui)}>${head}${body}${p.partial ? `<p class="dq" dir="auto"><b>${v.f_partial_b}</b>${v.f_partial}</p>` : ''}${kind === 'unavailable' ? '' : acts(v)}</article>`;
};

// ---- Today home pieces (TodayHome.tsx) ----
export const hero = (v) => `<section class="hero" aria-label="Net sales"><p class="lbl" dir="auto">${v.h_lbl}</p><p class="big">${v.h_big}</p><span class="pill good">${mi('up', 18)}${v.h_delta}</span></section>`;
export const dock = (v, ui) => `<div class="dock" ${B(ui)}><div class="chips" role="group"><button type="button" class="chip-btn">${v.dk_chip1}</button><button type="button" class="chip-btn">${v.dk_chip2}</button><button type="button" class="chip-btn">${v.dk_chip3}</button></div><form class="askrow"><label class="askin"><input placeholder="${v.dk_ph}" aria-label="${v.dk_ph}"><button type="button" class="rbtn acc" aria-label="${v.dk_mic}">${mi('mic', 24)}</button></label><button type="button" class="rbtn outline" aria-label="${v.dk_call}">${mi('phone', 24)}</button></form></div>`;
export const crow = (v, n, o = {}) => `<div class="crow" role="button" tabindex="0"><span class="glyph">${mi(o.voice ? 'mic' : 'sparkle', 20)}</span><span class="crow-t"><b dir="auto">${v['r' + n + '_t']}</b><span dir="auto"${o.pending ? ' class="pend"' : ''}>${v['r' + n + '_p']}</span></span>${o.pending ? '<span class="pdot" aria-hidden="true"></span>' : ''}<time>${v['r' + n + '_w']}</time><button type="button" class="crow-more" aria-label="${v.c_more}">${mi('kebab', 20)}</button></div>`;

export const briefScreen = (id, inner, cls = '') => screen(390, 844, `<div class="bf bf-screen ${cls}">${inner}</div>`, id);
export { screen };


// ---- Chat (chat/ChatTab.tsx, chat/Card.tsx, chat/Waveform.tsx, chat/Player.tsx) ----
export const wave = () => `<div class="wave" aria-hidden="true">${[14, 22, 38, 52, 30, 64, 80, 46, 28, 58, 72, 40, 24, 36, 66, 88, 54, 32, 20, 44, 70, 60, 34, 26, 48, 76, 42, 30, 18, 28, 50, 62, 36, 22, 16, 12].map((h) => `<i style="height:${h}%"></i>`).join('')}</div>`;
const stamp = (t, tick) => `<span class="stamp-pad" aria-hidden="true"></span><span class="stamp">${t}${tick ? mi('dtick', 16) : ''}</span>`;
const kpi = (l, val, d) => `<div class="card-kpi"><dt>${l}</dt><dd><bdi class="card-kpi-val">${val}</bdi><span class="card-delta tone-good"><span class="card-trend" aria-hidden="true">\u25B2</span><bdi>${d}</bdi></span></dd></div>`;
export const kpiCard = (v) => `<div class="cards"><figure class="card card-kpi"><figcaption class="card-title" dir="auto">${v.kc_title}<span class="card-sub"><bdi>${v.kc_sub}</bdi></span></figcaption><div class="card-body"><dl class="card-kpis">${kpi(v.kc_l1, v.kc_v1, v.kc_d1)}${kpi(v.kc_l2, v.kc_v2, v.kc_d2)}</dl></div><a class="card-link" href="#">${v.kc_link}</a></figure></div>`;
export const barCard = (v) => `<div class="cards"><figure class="card card-bar"><figcaption class="card-title" dir="auto">${v.bc_title}</figcaption><div class="card-body">${bars([[v.i1, v.p1, 100], [v.i2, v.p2, 74], [v.i3, v.p3, 64]])}</div><p class="card-note" dir="auto">${v.bc_note}</p></figure></div>`;
export const player = (v) => `<div class="player"><button type="button" class="play" aria-label="${v.ch_play}">${mi('play', 22)}</button>${wave().replace('class="wave"', 'class="wave wave--player" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"').replace(' aria-hidden="true"', '')}</div>`;
export const composer = (v, ui, rec) => rec
  ? `<div class="composer rec" role="group" ${B(ui, 'composer')}><div class="field rec-pill"><button type="button" class="cancel" aria-label="${v.ch_cancel}">${mi('close', 22)}</button><span class="rec-dot" aria-hidden="true"></span><span class="timer">${v.ch_timer}</span>${wave()}</div><button type="button" class="act" aria-label="${v.ch_sendv}">${mi('send', 22)}</button></div>`
  : `<form class="composer" ${B(ui, 'composer')}><div class="field"><textarea dir="auto" rows="1" placeholder="${v.ch_ph}" aria-label="${v.ch_ph}"></textarea><button type="button" class="act mic" aria-label="${v.ch_rec}">${mi('mic', 22)}</button></div></form>`;
export const threadBar = (v, ui) => `<header class="thread-bar" ${B(ui, 'thread-bar')}><button type="button" class="sub-btn" aria-label="${v.ch_back}">${mi('back', 24, 'mirror')}</button><h1 class="thread-title" dir="auto">${v.ch_title}</h1><button type="button" class="sub-btn" aria-label="${v.tb_call}">${mi('phone', 24)}</button></header>`;
export const messages = (v, p = {}) => p.empty
  ? `<div class="msgs" role="log"><div class="intro"><h2>${v.ch_intro}</h2><p class="sub">${v.ch_intro_s}</p><div class="starters"><button type="button" class="starter">${v.ch_st1}</button><button type="button" class="starter">${v.ch_st2}</button></div></div></div>`
  : `<div class="msgs" role="log"><div class="day-chip" role="separator">${v.ch_day}</div>
<div class="msg user first"><div class="bubble"><p dir="auto">${v.ch_u1}</p>${stamp(v.ch_u1t, true)}</div></div>
<div class="msg assistant first"><div class="bubble"><div class="md"><p>${v.ch_a1}</p></div>${kpiCard(v)}${player(v)}${stamp(v.ch_a1t)}</div></div>
<div class="msg user first"><div class="bubble"><p dir="auto"><span class="voice">${mi('mic', 14)}${v.ch_voice}:</span> ${v.ch_u2}</p>${stamp(v.ch_u2t, true)}</div></div>
<div class="msg assistant first"><div class="bubble"><div class="md"><p>${v.ch_a2}</p></div>${barCard(v)}${stamp(v.ch_a2t)}</div></div>
${p.typing ? '<div class="msg assistant"><div class="bubble typing" role="status"><i></i><i></i><i></i></div></div>' : ''}</div>`;

// ---- Call (call/CallTab.tsx + call.css) ----
export const callView = (v, ui, p = {}) => {
  const st = p.state || 'listening', inCall = ['listening', 'speaking'].includes(st), muted = !!p.muted;
  const status = { idle: v.cl_idle, listening: muted ? v.cl_muted : v.cl_listen, speaking: v.cl_speak, failed: v.cl_fail, ended: v.cl_end_s }[st];
  const goLabel = st === 'failed' ? v.cl_retry : st === 'ended' ? v.cl_again : v.cl_call;
  const lvl = { listening: 0.35, speaking: 0.8 }[st] ?? 0;
  const ctl = inCall
    ? `<div class="call-ctl"><button type="button" class="call-round call-mute" aria-pressed="${muted}" aria-label="${muted ? v.cl_unmute : v.cl_mute}">${mi('mic', 28)}</button><span class="call-ctl-label">${muted ? v.cl_unmute : v.cl_mute}</span></div><div class="call-ctl"><button type="button" class="call-round call-end" aria-label="${v.cl_end}">${mi('phone', 28)}</button><span class="call-ctl-label">${v.cl_end}</span></div>`
    : `<div class="call-ctl"><button type="button" class="call-round call-go" aria-label="${goLabel}">${mi('phone', 28)}</button><span class="call-ctl-label">${goLabel}</span></div>`;
  return `<section class="call" data-state="${st}" data-muted="${muted && inCall}" aria-label="${v.cl_name}" ${B(ui)} style="--level:${lvl}">
<div class="call-top"><button type="button" class="call-iconbtn" aria-label="${v.cl_back}">${mi('back', 24)}</button>${inCall ? `<p class="call-left" data-tone="">${v.cl_left}</p>` : ''}</div>
<div class="call-stage"><div class="call-orb" aria-hidden="true"><span class="orb-glow"></span><span class="orb-ring" style="--i:1"></span><span class="orb-ring" style="--i:2"></span><span class="orb-ring" style="--i:3"></span><span class="orb-core">${v.cl_orb}</span></div>
<h2 class="call-name" dir="auto">${v.cl_name}</h2><p class="call-status" role="status" dir="auto">${status}</p>${st === 'failed' ? `<p class="call-detail" dir="auto">${v.cl_fail_d}</p>` : ''}${inCall ? `<p class="call-time">${v.cl_time}</p>` : ''}${st === 'idle' ? `<p class="call-time">${v.cl_hint}</p>` : ''}</div>
<div class="call-caption">${inCall ? `<p class="call-line" dir="auto"><span class="call-line-who">${v.cl_you}</span>${v.cl_line1}</p>` : ''}</div>
<div class="call-controls">${ctl}</div></section>`;
};

// ---- Settings (settings/Settings.tsx + settings.css) ----
export const settingsBody = (v, ui) => `<div class="st-head"><h2>${v.s_title}</h2><button type="button" class="icon-btn" aria-label="${v.s_close}">${mi('close', 24)}</button></div>
<div class="st-body"><div class="st-profile"><span class="st-avatar" aria-hidden="true">${v.s_ini}</span><p class="st-who">${v.s_who}</p></div>
<div class="st-field"><label>${v.s_theme}</label><select class="st-select" ${B(ui, 'select-theme')}><option>${v.s_theme_v}</option></select></div>
<div class="st-field"><label>${v.s_lang}</label><select class="st-select" ${B(ui, 'select-lang')}><option>${v.s_lang_v}</option></select></div>
<label class="st-row"><span>${v.s_read}</span><input type="checkbox" checked></label></div>`;
