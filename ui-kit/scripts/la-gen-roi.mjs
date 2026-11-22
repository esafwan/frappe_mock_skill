// Generator for the Program ROI report components (la-report-intro, la-report-filters, la-report-notice, la-roi-kpis, la-measure-table)
// and tokens/css/la-desk-report.css. Deterministic. Sampled from ux-after-r1/rpt-program-roi__desktop-light.png (1440x900 @1x).
//   node scripts/la-gen-roi.mjs
import fs from 'fs'; import { ROOT } from './lib.mjs';
const W = (p, s) => { fs.mkdirSync(ROOT + p.split('/').slice(0, -1).join('/'), { recursive: true }); fs.writeFileSync(ROOT + p, typeof s === 'string' ? s : JSON.stringify(s, null, 1)); };
const S = (type, sample, maxLength, where = 'text') => ({ type, sample, maxLength, where });
const meta = (id, name, extra) => ({ id, name, system: 'loyal-arrow-desk', kind: 'widget', viewport: { w: 1127, h: 120 }, shell: true, css: ['la-desk-report.css'], ...extra });
const comp = (dir, m, html, slots, texts) => { W(`components/la/${dir}/component.json`, m); W(`components/la/${dir}/component.html`, html); W(`components/la/${dir}/slots.json`, { slots }); W(`components/la/${dir}/texts.json`, texts); };
export const MEASURES = [  // [en, ar, kind]
  ['Members who bought in this period', 'الأعضاء الذين اشتروا في هذه الفترة', 'n'], ['Member bills (after refunds)', 'فواتير الأعضاء (بعد المرتجعات)', 'n'], ['Member sales', 'مبيعات الأعضاء', 'a'],
  ['Average member bill', 'متوسط فاتورة العضو', 'a'], ['Non-member bills (after refunds)', 'فواتير غير الأعضاء (بعد المرتجعات)', 'n'], ['Non-member sales', 'مبيعات غير الأعضاء', 'a'],
  ['Average non-member bill', 'متوسط فاتورة غير العضو', 'a'], ['Extra spend per member bill', 'الإنفاق الإضافي لكل فاتورة عضو', 'a'], ['Extra spend per member bill (%)', 'الإنفاق الإضافي لكل فاتورة عضو (%)', 'n'],
  ['Extra sales from members vs non-members', 'مبيعات إضافية من الأعضاء مقابل غير الأعضاء', 'a'], ['Points redeemed (after cancellations)', 'النقاط المستبدلة (بعد الإلغاءات)', 'n'], ['Value of points redeemed', 'قيمة النقاط المستبدلة', 'a'],
  ['Cost of reward items given', 'تكلفة المكافآت الممنوحة', 'a'], ['Total program cost', 'إجمالي تكلفة البرنامج', 'a'], ['Return on the program', 'العائد على البرنامج', 'n'], ['Net result after program cost', 'صافي النتيجة بعد تكلفة البرنامج', 'a']];

/* intro */
comp('report-intro', meta('la-report-intro', 'Report intro (live query stamp + about link)', { viewport: { w: 1127, h: 20 } }),
  `<div class="la-rintro" data-ui="la-report-intro"><span class="la-rintro-text" data-ui="la-report-intro.text">{{liveText}}</span><span class="la-rintro-dot">·</span><span class="la-rintro-link" data-ui="la-report-intro.about">{{aboutLink}}</span></div>\n`,
  { liveText: S('text', 'Live query as of 2026-11-12 15:57 (Asia/Dubai).', 64), aboutLink: S('text', 'About this report +', 28) },
  { liveText: { ar: 'استعلام مباشر حتى ٢٠٢٦-١١-١٢ ١٥:٥٧ (آسيا/دبي).' }, aboutLink: { ar: 'حول هذا التقرير +' } });

/* filters */
{ const slots = { periodLabel: S('text', 'Period', 14), pill1: S('text', '7d', 14), pill2: S('text', '30d', 14), pill3: S('text', '90d', 14), pill4: S('text', 'QTD', 14), pill5: S('text', 'Custom', 14), programLabel: S('text', 'Program', 14), programValue: S('text', 'Hyper Rewards', 24), moreFilters: S('text', 'More filters', 16), reset: S('text', 'Reset', 10) };
  const st = ['active-90d', 'active-7d', 'active-30d', 'active-qtd', 'active-custom'];
  comp('report-filters', meta('la-report-filters', 'Report filters (period pills, program, more filters, reset)', { viewport: { w: 1127, h: 63 }, states: st, notes: 'Pill group is a segmented control; active pill chosen by data-state=active-<preset>. Targets: pill-1..5 (7d..Custom), program-value, more, reset.' }),
    `<div class="la-rfilters" data-ui="la-report-filters" data-state="{{state}}">
  <div class="la-rf-col"><span class="la-rf-label" data-ui="la-report-filters.period-label">{{periodLabel}}</span><div class="la-rf-seg" data-ui="la-report-filters.period"><span class="la-rf-pill" data-ui="la-report-filters.pill-1">{{pill1}}</span><span class="la-rf-pill" data-ui="la-report-filters.pill-2">{{pill2}}</span><span class="la-rf-pill" data-ui="la-report-filters.pill-3">{{pill3}}</span><span class="la-rf-pill" data-ui="la-report-filters.pill-4">{{pill4}}</span><span class="la-rf-pill" data-ui="la-report-filters.pill-5">{{pill5}}</span></div></div>
  <div class="la-rf-col la-rf-prog"><span class="la-rf-label">{{programLabel}}</span><span class="la-rf-field" data-ui="la-report-filters.program-value">{{programValue}}</span></div>
  <span class="la-rf-more" data-ui="la-report-filters.more">{{moreFilters}}</span><span class="la-rf-reset" data-ui="la-report-filters.reset">{{reset}}</span>
</div>\n`, slots,
    { periodLabel: { ar: 'الفترة' }, pill1: { ar: '٧ أيام' }, pill2: { ar: '٣٠ يومًا' }, pill3: { ar: '٩٠ يومًا' }, pill4: { ar: 'الربع الحالي' }, pill5: { ar: 'مخصص' }, programLabel: { ar: 'البرنامج' }, programValue: { ar: 'هايبر ريواردز' }, moreFilters: { ar: 'مزيد من المرشحات' }, reset: { ar: 'إعادة ضبط' } }); }

/* notice */
comp('report-notice', meta('la-report-notice', 'Report notice (info / warning / none)', { viewport: { w: 1127, h: 37 }, states: ['info', 'warning', 'none'], stateText: { warning: { text: 'No loyalty program is set up for this report yet.' }, none: { text: '' } } }),
  `<div class="la-rnotice" data-ui="la-report-notice" data-state="{{state}}" role="status"><svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg><span class="la-rnotice-text" data-ui="la-report-notice.text">{{text}}</span></div>\n`,
  { text: S('text', 'Not enough data yet to say whether the program paid for itself.', 80) },
  { text: { ar: 'لا توجد بيانات كافية بعد لمعرفة ما إذا كان البرنامج قد غطّى تكلفته.' } });

/* kpis */
{ const slots = {}, tx = {}; const L = [['Member sales', 'مبيعات الأعضاء'], ['Average member bill', 'متوسط فاتورة العضو'], ['Extra spend per member bill', 'الإنفاق الإضافي لكل فاتورة'], ['Total program cost', 'إجمالي تكلفة البرنامج'], ['Return on the program', 'العائد على البرنامج']];
  const V = ['AED 0.00', '—', '—', 'AED 2,610.00', '—'], U = ['', 'Not enough data', 'Not enough data', '', 'Not enough data']; const T = ['text', 'text', 'text', 'text', 'text'];
  let h = '<div class="la-rkpis" data-ui="la-roi-kpis" data-state="{{state}}">\n';
  for (let i = 1; i <= 5; i++) { slots['label' + i] = S('text', L[i - 1][0], 30); slots['value' + i] = S(i === 1 || i === 4 ? 'currency' : 'text', V[i - 1], 18); slots['sub' + i] = S('text', U[i - 1], 24); tx['label' + i] = { ar: L[i - 1][1] }; if (U[i - 1]) tx['sub' + i] = { ar: 'لا توجد بيانات كافية' };
    h += `  <div class="la-rkpi" data-ui="la-roi-kpis.kpi-${i}"><span class="la-rkpi-label" data-ui="la-roi-kpis.kpi-${i}.label">{{label${i}}}</span><span class="la-rkpi-value la-num" data-ui="la-roi-kpis.kpi-${i}.value">{{value${i}}}</span><span class="la-rkpi-sub" data-ui="la-roi-kpis.kpi-${i}.sub">{{sub${i}}}</span></div>\n`; }
  comp('roi-kpis', meta('la-roi-kpis', 'Program ROI KPI row (5 tiles: label, value, sub)', { viewport: { w: 1127, h: 112 }, states: ['not-enough-data'], notes: 'Tiles are targets kpi-1..5 with .value/.label/.sub children (zoom to value). Values are text/currency slots; unavailable = em dash + sub "Not enough data".' }), h + '</div>\n', slots, tx); }

/* measure table */
{ const slots = { idx_head: S('text', '', 2), col_measure: S('text', 'Measure', 14), col_number: S('text', 'Number', 10), col_amount: S('text', 'Amount', 10), col_status: S('text', 'Status', 12), col_note: S('text', 'Note', 10), empty_text: S('text', 'No measures to show for this period', 48) };
  const tx = { col_measure: { ar: 'المقياس' }, col_number: { ar: 'العدد' }, col_amount: { ar: 'المبلغ' }, col_status: { ar: 'الحالة' }, col_note: { ar: 'ملاحظة' }, empty_text: { ar: 'لا توجد مقاييس لعرضها لهذه الفترة' } };
  const SAMPLE = { 1: ['0', '', 'Available', ''], 2: ['0', '', 'Available', 'Purchases of in-scope members; each bill is counted once.'], 3: ['', 'AED 0.00', 'Available', ''], 4: ['', '', 'Not enough data', 'no member bills'] };
  let rows = '';
  MEASURES.forEach(([en, ar, k], i) => { const n = i + 1, s = SAMPLE[n] || ['', '', 'Not enough data', 'non-member bill capture is off (the non-member measures need it).'];
    slots['m' + n] = S('text', en, 44); slots['num' + n] = S('text', s[0], 12); slots['amt' + n] = S(k === 'a' ? 'currency' : 'text', s[1], 18); slots['st' + n] = S('text', s[2], 24); slots['note' + n] = S('text', s[3], 120);
    tx['m' + n] = { ar }; tx['st' + n] = { ar: 'متاح' }; if (s[3]) tx['note' + n] = { ar: s[3] };
    rows += `<tr class="la-mt-row" data-ui="la-measure-table.row-${n}"><td class="la-mt-idx la-num">${n}</td><td class="la-mt-m" data-ui="la-measure-table.measure-${n}">{{m${n}}}</td><td class="la-mt-num la-num" data-ui="la-measure-table.num-${n}">{{num${n}}}</td><td class="la-mt-num la-num" data-ui="la-measure-table.amt-${n}">{{amt${n}}}</td><td class="la-mt-st" data-ui="la-measure-table.status-${n}">{{st${n}}}</td><td class="la-mt-note" data-ui="la-measure-table.note-${n}">{{note${n}}}</td></tr>`; });
  comp('measure-table', meta('la-measure-table', 'Measure table (index, measure, number, amount, status, note)', { viewport: { w: 1127, h: 540 }, states: ['populated', 'empty'], notes: 'Sixteen measure rows (rows 14-16 clipped by the body like the reference). empty state: show only the empty row (set via data-state).' }),
    `<div class="la-mt" data-ui="la-measure-table" data-state="{{state}}"><table class="la-mt-grid" data-ui="la-measure-table.grid"><colgroup><col class="c-idx"><col class="c-m"><col class="c-num"><col class="c-amt"><col class="c-st"><col class="c-note"></colgroup><thead><tr data-ui="la-measure-table.head"><th class="la-mt-idx">{{idx_head}}</th><th>{{col_measure}}</th><th class="la-mt-num">{{col_number}}</th><th class="la-mt-num">{{col_amount}}</th><th>{{col_status}}</th><th>{{col_note}}</th></tr></thead><tbody>${rows}<tr class="la-mt-empty" data-ui="la-measure-table.empty"><td colspan="6">{{empty_text}}</td></tr></tbody></table></div>\n`, slots, tx); }

/* css (tokens only) */
W('tokens/css/la-desk-report.css', `/* la-desk report layer: la-report-intro, la-report-filters, la-report-notice, la-roi-kpis, la-measure-table. Tokens only (--la-*), logical properties. Generated by scripts/la-gen-roi.mjs */
.la-rintro{height:20px;display:flex;align-items:center;font-size:var(--la-text-sm);color:var(--la-text-muted)}
.la-rintro-dot{margin-inline:8px}.la-rintro-link{color:var(--la-primary)}
.la-rfilters{display:flex;align-items:flex-end;padding-block:0 12px;border-block-end:1px solid var(--la-border);margin-block-start:40px}
.la-rf-col{display:flex;flex-direction:column;gap:6px}.la-rf-prog{margin-inline-start:16px;width:160px}
.la-rf-label{font-size:12px;line-height:16px;color:var(--la-text-muted)}
.la-rf-seg{display:flex;gap:7px;padding:2px;height:28px;box-sizing:border-box;background:var(--la-subtle);border-radius:var(--la-radius)}
.la-rf-pill{height:24px;padding-inline:10px;display:inline-flex;align-items:center;border-radius:var(--la-radius);font-size:var(--la-text-sm);color:var(--la-text-muted);box-sizing:border-box}
.la-rf-field{height:28px;padding-inline:8px;display:flex;align-items:center;background:var(--la-subtle);border-radius:var(--la-radius);font-size:var(--la-text-sm);font-weight:500;color:var(--la-text)}
.la-rf-more,.la-rf-reset{height:28px;display:inline-flex;align-items:center;font-size:var(--la-text-sm);color:var(--la-text-muted)}
.la-rf-more{margin-inline-start:40px}.la-rf-reset{margin-inline-start:32px}
.la-rfilters[data-state="active-7d"] .la-rf-pill:nth-child(1),.la-rfilters[data-state="active-30d"] .la-rf-pill:nth-child(2),.la-rfilters[data-state="active-90d"] .la-rf-pill:nth-child(3),.la-rfilters[data-state="active-qtd"] .la-rf-pill:nth-child(4),.la-rfilters[data-state="active-custom"] .la-rf-pill:nth-child(5){background:var(--la-sel-bg);box-shadow:var(--la-shadow-sel);color:var(--la-text);font-weight:500}
.la-rnotice{margin-block-start:25px;height:37px;display:flex;align-items:center;gap:10px;padding-inline:13px;border-radius:var(--la-radius-lg);background:var(--la-pill-blue-bg);border:1px solid var(--la-banner-info-bd);font-size:var(--la-text-sm);color:var(--la-text)}
.la-rnotice .la-ico{width:14px;height:14px;color:var(--la-pill-blue-fg)}
.la-rnotice[data-state="warning"]{background:var(--la-banner-warn-bg);border-color:var(--la-banner-warn-bd)}.la-rnotice[data-state="warning"] .la-ico{color:var(--la-banner-warn-bar)}
.la-rnotice[data-state="none"]{display:none}
.la-rkpis{margin-block-start:24px;display:grid;grid-template-columns:repeat(5,1fr);gap:16px}
.la-rnotice[data-state="none"]+.la-rkpis{margin-block-start:86px}
.la-rkpi{height:112px;box-sizing:border-box;padding:14px 16px 0;border:1px solid var(--la-border);border-radius:var(--la-radius-lg);display:flex;flex-direction:column}
.la-rkpi-label{font-size:var(--la-text-sm);line-height:16px;color:var(--la-text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:-.012em}
.la-rkpi-value{margin-block-start:14px;font-size:22px;line-height:28px;font-weight:600;color:var(--la-text)}
.la-rkpi-sub{margin-block-start:9px;font-size:12px;line-height:16px;color:var(--la-text-muted)}
.la-mt{margin-block-start:40px;border:1px solid var(--la-border);border-radius:var(--la-radius-lg);padding-inline:15px;overflow:hidden}
.la-mt-grid{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;font-size:var(--la-text-sm);color:var(--la-text)}
.la-mt-grid .c-idx{width:36px}.la-mt-grid .c-m{width:348px}.la-mt-grid .c-num{width:125px}.la-mt-grid .c-amt{width:150px}.la-mt-grid .c-st{width:150px}
.la-mt-grid th{background:var(--la-subtle);height:34px;font-weight:400;text-align:start;padding:4px 8px 0;white-space:nowrap}
.la-mt-grid th:first-child{border-start-start-radius:var(--la-radius);border-end-start-radius:var(--la-radius)}.la-mt-grid th:last-child{border-start-end-radius:var(--la-radius);border-end-end-radius:var(--la-radius)}
.la-mt-grid td{height:33px;box-sizing:border-box;padding:7px 8px 0;border-block-end:1px solid var(--la-border);white-space:nowrap;overflow:hidden}
.la-mt-grid .la-mt-idx{text-align:center;padding-inline:0}.la-mt-grid td.la-mt-m{padding-inline-start:11px}.la-mt-grid th:nth-child(2){padding-inline-start:11px}
.la-mt-grid .la-mt-num{text-align:end;padding-inline:0 12px}.la-mt-grid th.la-mt-num{padding-inline-end:20px}
.la-mt-empty{display:none}.la-mt-empty td{height:120px;text-align:center;color:var(--la-text-muted);border:0}
.la-mt[data-state="empty"] .la-mt-row{display:none}.la-mt[data-state="empty"] .la-mt-empty{display:table-row}
`);
console.log('la-gen-roi: components + css written');
