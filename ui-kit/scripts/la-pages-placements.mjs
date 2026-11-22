// Builds components/la/retail-placements (component.html, states/, slots.json, texts.json, component.json), then composes
// pages/la/retail-placements*.html from it + loyal-arrow/data/<region>/placements.json, with pixel boxes of every data-ui
// (pages/la/retail-placements.manifest.json) and optional screenshots.   node scripts/la-pages-placements.mjs [--shots dir]
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright'; import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const ID = 'retail-placements', U = 'la-retail-placements', OUT = ROOT + 'pages/la/', DATA = ROOT + '../loyal-arrow/data/', D = ROOT + `components/la/${ID}/`;
const shots = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const REG = { AED: 'uae-dubai-supermarket', SAR: 'uae-dubai-supermarket', QAR: 'uae-dubai-supermarket', KWD: 'uae-dubai-supermarket', INR: 'india-departmental-store' };
const CLS = { planned: 'is-blue', confirmed: 'is-green', not_carried_out: 'is-red' };
// state -> data row indexes shown, filter segment (1 All, 2 Planned, 3 Confirmed, 4 Not carried out, 5 Cancelled), whether row 1's Checks panel is open, empty kind
const STATES = { populated: { rows: [0, 1, 2], seg: 1, open: true }, collapsed: { rows: [0, 1, 2], seg: 1, open: false }, 'filter-planned': { rows: [1], seg: 2 }, 'filter-confirmed': { rows: [0], seg: 3, open: true }, 'filter-not-carried-out': { rows: [2], seg: 4 }, zero: { rows: [], seg: 5, empty: 'zero' }, empty: { rows: [], seg: 1, empty: 'empty' } };
const T = { // static labels: en sample + ar text; [maxLength] derived
  tab1: ['Funding', 'التمويل'], tab2: ['Placements', 'مواقع العرض'], tab3: ['Store groups', 'مجموعات الفروع'], tab4: ['Experiments', 'التجارب'], tab5: ['Change review', 'مراجعة التغييرات'],
  seg1: ['All', 'الكل'], seg2: ['Planned', 'مخطط'], seg3: ['Confirmed', 'مؤكد'], seg4: ['Not carried out', 'لم ينفذ'], seg5: ['Cancelled', 'ملغى'], btnNew: ['New placement', 'موقع عرض جديد'],
  colTitle: ['Title', 'العنوان'], colSet: ['Store set', 'مجموعة الفروع'], colPlaced: ['Placed on', 'موقع العرض'], colPlanned: ['Planned', 'الفترة المخططة'], colSkus: ['SKUs', 'الأصناف'], colStatus: ['Status', 'الحالة'],
  stPlanned: ['Planned', 'مخطط'], stConfirmed: ['Confirmed', 'مؤكد'], stNot: ['Not carried out', 'لم ينفذ'], btnChecks: ['Checks', 'الفحوصات'], btnChange: ['Change', 'تغيير'], btnDelete: ['Delete', 'حذف'],
  ckIn: ['In place', 'مطبق'], ckPartly: ['Partly in place', 'مطبق جزئيا'], lblFind: ['What did you find', 'ماذا وجدت'], lblOn: ['Checked on', 'تاريخ الفحص'], lblNote: ['Note', 'ملاحظة'], phChoose: ['Choose', 'اختر'], btnRecord: ['Record check', 'تسجيل الفحص'],
  emptyTitle: ['No placements yet', 'لا توجد مواقع عرض بعد'], emptyBody: ['Plan a shelf or end cap and it appears here.', 'خطط لرف أو ركن عرض ليظهر هنا.'], zeroTitle: ['No cancelled placements', 'لا توجد مواقع عرض ملغاة'], zeroBody: ['Cancelled placements appear here.', 'تظهر هنا مواقع العرض الملغاة.'],
};
const DYN = { // data-filled slots: [sample, maxLength, type]
  panelTitle: ['Checks for Ramadan dates end cap', 44, 'text'], checkedDate: ['22/11/2026', 12, 'date'],
  ...Object.fromEntries([1, 2, 3].flatMap(n => [[`r${n}_title`, ['Ramadan dates end cap', 32, 'text']], [`r${n}_set`, ['Ramadan promo stores', 28, 'text']], [`r${n}_where`, ['End cap', 16, 'text']], [`r${n}_planned`, ['Nov 1, 2026 - Nov 30, 2026', 34, 'date']], [`r${n}_skus`, ['3', 4, 'number']], [`r${n}_seen`, ['Seen Nov 3, 2026 to Nov 14, 2026', 44, 'date']]])),
  ...Object.fromEntries([1, 2].flatMap(n => [[`c${n}_pill`, ['In place', 18, 'text']], [`c${n}_date`, ['Nov 14, 2026', 14, 'date']], [`c${n}_note`, ['Full facing, price tags up', 40, 'text']]])),
};
const row = (n, st, seen) => `<tr class="la-tr" data-ui="${U}.row-${n}"><td class="la-pl-title" data-ui="${U}.r${n}-title">{{r${n}_title}}</td><td data-ui="${U}.r${n}-set">{{r${n}_set}}</td><td data-ui="${U}.r${n}-where">{{r${n}_where}}</td><td data-ui="${U}.r${n}-planned">{{r${n}_planned}}</td><td class="la-num" data-ui="${U}.r${n}-skus">{{r${n}_skus}}</td><td><span class="la-pill ${CLS[st]}" data-ui="${U}.r${n}-status">{{${{ planned: 'stPlanned', confirmed: 'stConfirmed', not_carried_out: 'stNot' }[st]}}}</span>${seen ? `<div class="la-pl-seen" data-ui="${U}.r${n}-seen">{{r${n}_seen}}</div>` : ''}</td><td><div class="la-pl-acts"><span class="la-btn" data-ui="${U}.r${n}-btn-checks">{{btnChecks}}</span><span class="la-btn" data-ui="${U}.r${n}-btn-change">{{btnChange}}</span><span class="la-btn" data-ui="${U}.r${n}-btn-delete">{{btnDelete}}</span></div></td></tr>`;
const panel = (checks) => `<tr class="la-pl-panelrow" data-ui="${U}.checks-row"><td colspan="7" class="la-pl-panelcell"><div class="la-pl-panel" data-ui="${U}.checks"><h3 class="la-pl-panel-title" data-ui="${U}.checks-title">{{panelTitle}}</h3><ul class="la-pl-checks" data-ui="${U}.checks-list">${checks.map((c, i) => `<li data-ui="${U}.check-${i + 1}"><span class="la-pill ${c === 'in_place' ? 'is-green' : 'is-amber'}" data-ui="${U}.check-${i + 1}-pill">{{c${i + 1}_pill}}</span> <span data-ui="${U}.check-${i + 1}-date">{{c${i + 1}_date}}</span> <span data-ui="${U}.check-${i + 1}-note">{{c${i + 1}_note}}</span></li>`).join('')}</ul><div class="la-pl-form" data-ui="${U}.record-form"><div class="la-pl-fld"><span class="la-pl-lbl" data-ui="${U}.record-find-label">{{lblFind}}</span><span class="la-pl-ctl is-sel" data-ui="${U}.record-find"><span>{{phChoose}}</span></span></div><div class="la-pl-fld"><span class="la-pl-lbl">{{lblOn}}</span><span class="la-pl-ctl is-date" data-ui="${U}.record-date"><span>{{checkedDate}}</span><svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg></span></div><div class="la-pl-fld"><span class="la-pl-lbl">{{lblNote}}</span><span class="la-pl-ctl is-note" data-ui="${U}.record-note"></span></div><span class="la-btn is-primary" data-ui="${U}.record-btn">{{btnRecord}}</span></div></div></td></tr>`;
const head = (st) => `<div class="la-pl" data-ui="${U}" data-state="{{state}}"><div class="la-tabs" data-ui="${U}.tabs" data-state="active-2" role="tablist">${[1, 2, 3, 4, 5].map(i => `<a class="la-tab" data-ui="${U}.tab-${i}" role="tab">{{tab${i}}}</a>`).join('')}</div><div class="la-pl-filters" data-ui="${U}.filters"><div class="la-segmented" data-ui="${U}.status" data-state="active-${STATES[st].seg}" role="tablist">${[1, 2, 3, 4, 5].map(i => `<span class="la-seg-opt" data-ui="${U}.status-${i}" role="tab">{{seg${i}}}</span>`).join('')}</div><span class="la-btn is-primary" data-ui="${U}.btn-new">{{btnNew}}</span></div>`;
const thead = `<thead><tr data-ui="${U}.head"><th data-ui="${U}.col-title">{{colTitle}}</th><th data-ui="${U}.col-set">{{colSet}}</th><th data-ui="${U}.col-placed">{{colPlaced}}</th><th data-ui="${U}.col-planned">{{colPlanned}}</th><th class="la-num" data-ui="${U}.col-skus">{{colSkus}}</th><th data-ui="${U}.col-status">{{colStatus}}</th><th></th></tr></thead>`;
const cols = '<colgroup><col style="width:178px"><col style="width:164px"><col style="width:100px"><col style="width:186px"><col style="width:65px"><col style="width:230px"><col style="width:245px"></colgroup>';
const STAT = ['confirmed', 'planned', 'not_carried_out']; // status of data rows 0..2 (same in every region)
function markup(st) {
  const s = STATES[st]; let h = head(st);
  if (s.empty) h += `<div class="la-pl-empty" data-ui="${U}.empty"><div class="la-pl-empty-title" data-ui="${U}.empty-title">{{${s.empty === 'zero' ? 'zeroTitle' : 'emptyTitle'}}}</div><div class="la-pl-empty-body" data-ui="${U}.empty-body">{{${s.empty === 'zero' ? 'zeroBody' : 'emptyBody'}}}</div></div>`;
  else { let body = ''; s.rows.forEach((di, i) => { const stt = STAT[di]; body += row(i + 1, stt, stt === 'confirmed'); if (i === 0 && s.open) body += panel(['in_place', 'partly']); }); h += `<div class="la-pl-wrap" data-ui="${U}.table"><table class="la-table la-pl-table">${cols}${thead}<tbody>${body}</tbody></table></div>`; }
  return h + '</div>';
}
fs.mkdirSync(D + 'states', { recursive: true });
fs.writeFileSync(D + 'component.html', markup('populated')); for (const st of Object.keys(STATES)) fs.writeFileSync(D + `states/${st}.html`, markup(st));
const slots = {}; for (const [k, [en]] of Object.entries(T)) slots[k] = { type: 'text', sample: en, maxLength: Math.max(en.length + 6, T[k][1].length + 4, 12), where: 'text' };
for (const [k, [s, m, t]] of Object.entries(DYN)) slots[k] = { type: t, sample: s, maxLength: m, where: 'text' };
fs.writeFileSync(D + 'slots.json', JSON.stringify({ slots }, null, 1)); fs.writeFileSync(D + 'texts.json', JSON.stringify(Object.fromEntries(Object.entries(T).map(([k, [, ar]]) => [k, { ar }])), null, 1));
fs.writeFileSync(D + 'component.json', JSON.stringify({ id: U, name: 'Retail placements (tabs, status filter, placements table, inline Checks panel with Record check form)', system: 'loyal-arrow-desk', kind: 'page-body', shell: false, viewport: { w: 1440, h: 900 }, css: ['la-desk-nav.css', 'la-desk-admin.css', 'la-desk-placements.css'], states: Object.keys(STATES), defaultState: 'populated', reference: 'rs-p2-retail-ui/placement_1440_light.png', notes: 'Interaction targets: r{n}-btn-checks (expand Checks), checks (expanded panel), record-find / record-date / record-note (form fields), record-btn (Record check), status-{1..5} (filter), btn-new, row-{n}. Data from data/<region>/placements.json via scripts/la-pages-placements.mjs. Statuses planned / confirmed / not carried out are separate states: populated, filter-planned, filter-confirmed, filter-not-carried-out; zero = Cancelled filter with none; empty = no placements.' }, null, 1));
// ---- data fill
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], MAR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const dg = (s) => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
function fillData(cur, lang, state) {
  const d = JSON.parse(fs.readFileSync(DATA + REG[cur] + '/placements.json')); const ar = lang === 'ar'; const s = STATES[state]; const set = {};
  const dt = (iso) => { const [y, m, dd] = iso.split('-').map(Number); return ar ? dg(`${dd} ${MAR[m - 1]} ${y}`) : `${MON[m - 1]} ${dd}, ${y}`; };
  s.rows.forEach((di, i) => { const p = d.placements[di], n = i + 1;
    set[`r${n}_title`] = ar ? p.title_ar : p.title; set[`r${n}_set`] = ar ? p.store_set_ar : p.store_set; set[`r${n}_where`] = ar ? p.where_ar : p.where;
    set[`r${n}_planned`] = `${dt(p.from)} - ${dt(p.to)}`; set[`r${n}_skus`] = ar ? dg(p.skus) : String(p.skus);
    if (p.seen) set[`r${n}_seen`] = ar ? `شوهد من ${dt(p.seen[0])} إلى ${dt(p.seen[1])}` : `Seen ${dt(p.seen[0])} to ${dt(p.seen[1])}`;
    if (i === 0 && s.open) { set.panelTitle = ar ? `فحوصات ${p.title_ar}` : `Checks for ${p.title}`; p.checks.forEach((c, k) => { set[`c${k + 1}_pill`] = T[c.result === 'in_place' ? 'ckIn' : 'ckPartly'][ar ? 1 : 0]; set[`c${k + 1}_date`] = dt(c.on); set[`c${k + 1}_note`] = ar ? c.note_ar : c.note; }); }
  });
  const [y, m, dd] = d.today.split('-').map(Number); set.checkedDate = ar ? dg(`${dd}/${m}/${y}`) : `${String(dd).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  return set;
}
const V = [['', 'populated', 'light', 'en', 'AED'], ['.dark', 'populated', 'dark', 'en', 'AED'], ['.ar-AED', 'populated', 'light', 'ar', 'AED'], ['.ar-AED.dark', 'populated', 'dark', 'ar', 'AED'], ['.en-INR', 'populated', 'light', 'en', 'INR'],
  ['.collapsed', 'collapsed', 'light', 'en', 'AED'], ['.filter-planned', 'filter-planned', 'light', 'en', 'AED'], ['.filter-confirmed', 'filter-confirmed', 'light', 'en', 'AED'], ['.filter-not-carried-out', 'filter-not-carried-out', 'light', 'en', 'AED'],
  ['.empty', 'empty', 'light', 'en', 'AED'], ['.zero', 'zero', 'light', 'en', 'AED'], ['.empty.dark', 'empty', 'dark', 'en', 'AED'], ['.zero.ar-AED', 'zero', 'light', 'ar', 'AED'], ['.filter-planned.ar-AED', 'filter-planned', 'light', 'ar', 'AED']];
const browser = await chromium.launch(); const man = { page: ID, system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p2-retail-ui/placement_1440_light.png', variants: {} };
for (const [suf, state, theme, lang, cur] of V) {
  const html = renderLa(ID, { state, theme, lang, currency: cur, cssBase: '../../tokens/css/', set: fillData(cur, lang, state) });
  const f = `${ID}${suf}.html`; fs.writeFileSync(OUT + f, html);
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); await p.goto('file://' + OUT + f); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(b => b.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + f);
  man.variants[f] = { state, theme, lang, currency: cur, targets: boxes };
  if (shots) { fs.mkdirSync(shots, { recursive: true }); await p.screenshot({ path: path.join(shots, f.replace('.html', '.png')) }); } await p.close();
}
fs.writeFileSync(OUT + `${ID}.manifest.json`, JSON.stringify(man, null, 1)); await browser.close(); console.log('wrote', V.length, 'variants');
