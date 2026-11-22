// Generator for the LA data components: la-heat-table, la-cat-heat-grid, la-report-table, la-empty-state.
// Writes components/la/<id>/{component.html,slots.json,component.json,texts.json} and tokens/css/la-desk-data.css. Deterministic.
//   node scripts/la-gen-data.mjs
import fs from 'fs'; import { ROOT } from './lib.mjs';
const W = (p, s) => { fs.mkdirSync(ROOT + p.split('/').slice(0, -1).join('/'), { recursive: true }); fs.writeFileSync(ROOT + p, typeof s === 'string' ? s : JSON.stringify(s)); };
const meta = (id, name, extra) => ({ id, name, system: 'loyal-arrow-desk', kind: 'widget', viewport: { w: 1440, h: 900 }, shell: true, ...extra });
const S = (type, sample, maxLength, where = 'text') => ({ type, sample, maxLength, where });
const AR = '٠١٢٣٤٥٦٧٨٩';

/* ---------- la-heat-table : cohort retention heat table (rpt-cohorts) ---------- */
{
  const R = 4, C = 6; const rows = [['May 2025', '56', ['67.85%', '78.57%', '67.85%', '71.42%', '66.07%', '71.42%'], ['38', '44', '38', '40', '37', '40'], [4, 4, 4, 4, 2, 4]],
    ['Jun 2025', '110', ['68.18%', '82.72%', '71.81%', '72.72%', '70%', '72.72%'], ['75', '91', '79', '80', '77', '80'], [4, 4, 4, 4, 4, 4]],
    ['Jul 2025', '117', ['77.77%', '73.5%', '78.63%', '68.37%', '71.79%', '71.79%'], ['91', '86', '92', '80', '84', '84'], [4, 4, 4, 4, 4, 4]],
    ['Aug 2025', '98', ['70.4%', '66.32%', '64.28%', '65.3%', '-', '-'], ['69', '65', '63', '64', '-', '-'], [4, 2, 2, 2, 0, 0]]];
  const slots = { mode: S('text', 'percent', 12), mode_label: S('text', 'Heatmap shows', 24), idx_head: S('text', '#', 2), row_head: S('text', 'Cohort month', 20), size_head: S('text', 'Members', 14), empty_cell: S('text', '-', 2) };
  const ar = { mode: { ar: 'النسبة' }, mode_label: { ar: 'عرض الخريطة' }, row_head: { ar: 'شهر المجموعة' }, size_head: { ar: 'الأعضاء' } };
  const arMonth = ['مايو 2025', 'يونيو 2025', 'يوليو 2025', 'أغسطس 2025']; const arCol = ['احتفاظ م+1', 'احتفاظ م+2', 'احتفاظ م+3', 'احتفاظ م+4', 'احتفاظ م+5', 'احتفاظ م+6'];
  for (let c = 1; c <= C; c++) { slots['col_' + c] = S('text', `M+${c} retained`, 18); ar['col_' + c] = { ar: arCol[c - 1] }; }
  let tb = ''; const states = { count: {}, 'cell-hover': {}, 'diagonal-highlight': {}, empty: {} };
  rows.forEach((r, i) => { const n = i + 1; slots['row_' + n] = S('text', r[0], 12); ar['row_' + n] = { ar: arMonth[i] }; slots['size_' + n] = S('number', r[1], 5);
    tb += `<tr data-ui="la-heat-table.row-${n}"><td class="la-hc-idx la-num">${n}</td><td class="la-hc-rowh">{{row_${n}}}</td><td class="la-hc-size la-num">{{size_${n}}}</td>`;
    for (let c = 1; c <= C; c++) { const k = `r${n}c${c}`; slots['val_' + k] = S('number', r[2][c - 1], 7); slots['int_' + k] = S('number', String(r[4][c - 1]), 1, 'class');
      states.count['val_' + k] = r[3][c - 1]; states.empty['val_' + k] = '-'; states.empty['int_' + k] = '0';
      tb += `<td class="la-hc la-heat-{{int_${k}}} la-num" data-ui="la-heat-table.cell-${k}">{{val_${k}}}</td>`; } tb += '</tr>'; });
  for (const s of ['count']) states[s].mode = 'count'; states.empty.mode = 'percent';
  const th = `<tr data-ui="la-heat-table.head"><th class="la-hc-idx">{{idx_head}}</th><th class="la-hc-rowh">{{row_head}}</th><th class="la-hc-size la-num">{{size_head}}</th>${[1, 2, 3, 4, 5, 6].map(c => `<th class="la-hc-col">{{col_${c}}}</th>`).join('')}</tr>`;
  W('components/la/heat-table/component.html', `<div class="la-heat-table is-{{state}}" data-ui="la-heat-table">\n  <div class="la-heat-mode" data-ui="la-heat-table.mode"><span>{{mode_label}}</span><b>{{mode}}</b></div>\n  <div class="la-heat-card">\n  <table class="la-heat-grid" data-ui="la-heat-table.grid">\n    <thead>${th}</thead>\n    <tbody>${tb}</tbody>\n  </table></div>\n</div>\n`);
  W('components/la/heat-table/slots.json', { slots, groups: { rowHeader: 'row_N', colHeaders: 'col_N', cellValue: 'val_rNcM', cellIntensity: 'int_rNcM (class token 0-5, not text)', mode: 'mode' } });
  W('components/la/heat-table/texts.json', ar);
  W('components/la/heat-table/component.json', meta('la-heat-table', 'Cohort retention heat table (percent/count heat cells)', { states: ['percent', 'count', 'cell-hover', 'diagonal-highlight', 'empty'], stateSlots: states, reference: 'report-fit/rpt-cohorts__desktop-light.png', notes: 'Intensity 0-5 is a class token (la-heat-N) so a video can re-colour a cell. Hover = row 2 col 3; diagonal = r1c1..r4c4; cols 5-6 are partly clipped by the card like the reference (CSS nth-child).' }));
}

/* ---------- la-cat-heat-grid : category x store heatmap with meters (rs-p1a-heatmap) ---------- */
{
  const stores = ['Hawalli', 'Jabriya', 'Salmiya'], cats = ['Bakery', 'Beauty', 'Dairy', 'Grocery'];
  const arS = ['حولي', 'الجابرية', 'سلمية'], arC = ['مخبوزات', 'تجميل', 'ألبان', 'بقالة'];
  const v = [['182', '203', '300', '752'], ['96', '88', '131', '244'], ['354', '412', '676', '1,182']], p = [['12.6%', '14.2%', '20.9%', '52.3%'], ['7.1%', '6.4%', '9.8%', '18.2%'], ['14.4%', '16.8%', '27.5%', '48%']];
  const m = [[25, 25, 40, 100], [15, 10, 20, 35], [25, 30, 50, 90]];
  const slots = { store_head: S('text', 'Store', 12), suppressed: S('text', 'Not enough data', 20) }; const ar = { store_head: { ar: 'المتجر' }, suppressed: { ar: 'بيانات غير كافية' } };
  cats.forEach((c, j) => { slots['cat_' + (j + 1)] = S('text', c, 16); ar['cat_' + (j + 1)] = { ar: arC[j] }; });
  let tb = ''; const sh = `<tr data-ui="la-cat-heat-grid.head"><th class="la-cg-store">{{store_head}}</th>${cats.map((_, j) => `<th class="la-cg-cat">{{cat_${j + 1}}}</th>`).join('')}</tr>`;
  stores.forEach((s, i) => { const n = i + 1; slots['store_' + n] = S('text', s, 16); ar['store_' + n] = { ar: arS[i] }; tb += `<tr data-ui="la-cat-heat-grid.row-${n}"><th class="la-cg-store">{{store_${n}}}</th>`;
    cats.forEach((_, j) => { const k = `r${n}c${j + 1}`; slots['val_' + k] = S('number', v[i][j], 6); slots['pct_' + k] = S('number', p[i][j], 6); slots['meter_' + k] = S('number', String(m[i][j]), 3, 'class');
      tb += `<td class="la-cg-cell" data-ui="la-cat-heat-grid.cell-${k}"><div class="la-cg-body"><div class="la-cg-val la-num">{{val_${k}}}</div><div class="la-cg-pct la-num">{{pct_${k}}}</div><div class="la-cg-meter"><i class="la-cg-fill la-cg-fill-{{meter_${k}}}"></i></div></div><div class="la-cg-sup">{{suppressed}}</div></td>`; }); tb += '</tr>'; });
  W('components/la/cat-heat-grid/component.html', `<div class="la-cat-heat-grid is-{{state}}" data-ui="la-cat-heat-grid">\n  <table class="la-cg" data-ui="la-cat-heat-grid.grid">\n    <thead>${sh}</thead>\n    <tbody>${tb}</tbody>\n  </table>\n</div>\n`);
  W('components/la/cat-heat-grid/slots.json', { slots, groups: { storeLabel: 'store_N', categoryLabel: 'cat_N', cellValue: 'val_rNcM', cellPct: 'pct_rNcM', cellMeter: 'meter_rNcM (class token 0-100 step 5, not text)' } });
  W('components/la/cat-heat-grid/texts.json', ar);
  W('components/la/cat-heat-grid/component.json', meta('la-cat-heat-grid', 'Category by store heat grid (value, share, meter)', { states: ['populated', 'suppressed-not-enough-data', 'cell-hover'], reference: 'rs-p1a-heatmap/after_heatmap_1440_light.png', notes: 'Suppressed state hides cells below 10 bills: row 2 entirely and r3c2 (CSS nth-child), showing the suppressed slot. Hover = r1c3.' }));
}

/* ---------- la-report-table : report table with status pill + note ---------- */
{
  const stores = ['Hawalli', 'Jabriya', 'Salmiya', 'Mangaf'], arS = ['حولي', 'الجابرية', 'سلمية', 'المنقف'];
  const bills = ['73', '13', '103', '58'], spend = ['AED 4,820.00', 'AED 905.00', 'AED 7,340.00', 'AED 3,110.00'], tone = ['green', 'amber', 'green', 'gray'], stat = ['Healthy', 'Low volume', 'Healthy', 'Syncing'], note = ['82.2% with a member', 'Fewer than 20 bills', '82.5% with a member', 'Last sync pending'];
  const arSt = ['سليم', 'حجم منخفض', 'سليم', 'قيد المزامنة'], arN = ['82.2% مع عضو', 'أقل من 20 فاتورة', '82.5% مع عضو', 'المزامنة معلّقة'];
  const cols = ['Store', 'Bills', 'Spend', 'Status', 'Note'], arCols = ['المتجر', 'الفواتير', 'الإنفاق', 'الحالة', 'ملاحظة'];
  const slots = { empty_text: S('text', 'No rows to show', 28) }; const ar = { empty_text: { ar: 'لا توجد صفوف للعرض' } };
  cols.forEach((c, j) => { slots['col_' + (j + 1)] = S('text', c, 14); ar['col_' + (j + 1)] = { ar: arCols[j] }; });
  let tb = ''; const sk = `<td><span class="la-skel"></span></td>`;
  stores.forEach((s, i) => { const n = i + 1; slots['r' + n + 'c1'] = S('text', s, 18); ar['r' + n + 'c1'] = { ar: arS[i] }; slots['r' + n + 'c2'] = S('number', bills[i], 6); slots['r' + n + 'c3'] = S('currency', spend[i], 16);
    slots['r' + n + '_status'] = S('text', stat[i], 14); ar['r' + n + '_status'] = { ar: arSt[i] }; slots['r' + n + '_tone'] = S('text', tone[i], 6, 'class'); slots['r' + n + '_note'] = S('text', note[i], 28); ar['r' + n + '_note'] = { ar: arN[i] };
    tb += `<tr class="la-rt-row" data-ui="la-report-table.row-${n}"><td class="la-rt-c1">{{r${n}c1}}</td><td class="la-rt-num la-num">{{r${n}c2}}</td><td class="la-rt-num la-num">{{r${n}c3}}</td><td><span class="la-pill is-{{r${n}_tone}}" data-ui="la-report-table.status-${n}">{{r${n}_status}}</span></td><td class="la-rt-note" data-ui="la-report-table.note-${n}">{{r${n}_note}}</td></tr>`; });
  let skel = ''; for (let i = 0; i < 4; i++) skel += `<tr class="la-rt-skel">${sk.repeat(5)}</tr>`;
  W('components/la/report-table/component.html', `<div class="la-report-table is-{{state}}" data-ui="la-report-table">\n  <table class="la-table la-rt" data-ui="la-report-table.grid">\n    <thead><tr data-ui="la-report-table.head"><th>{{col_1}}</th><th class="la-rt-num">{{col_2}}</th><th class="la-rt-num">{{col_3}}</th><th>{{col_4}}</th><th>{{col_5}}</th></tr></thead>\n    <tbody>${tb}${skel}<tr class="la-rt-empty" data-ui="la-report-table.empty"><td colspan="5">{{empty_text}}</td></tr></tbody>\n  </table>\n</div>\n`);
  W('components/la/report-table/slots.json', { slots, groups: { columnLabels: 'col_N', rowCells: 'rNc1..rNc3 (c3 is currency)', statusCell: 'rN_status + rN_tone (green|amber|red|gray)', noteCell: 'rN_note' } });
  W('components/la/report-table/texts.json', ar);
  W('components/la/report-table/component.json', meta('la-report-table', 'Report table (rows, status pill, note)', { states: ['populated', 'empty', 'row-hover', 'loading'], reference: 'rs-p1a-heatmap/after_heatmap_1440_light.png (Bills with a member, by store)', notes: 'Loading shows skeleton rows (no text). Hover = row 2. Spend column is a currency slot (AED/SAR/QAR/KWD/INR).' }));
}

/* ---------- la-empty-state ---------- */
{
  const slots = { icon: S('text', 'chart', 12, 'class'), title: S('text', 'No data yet', 32), body: S('text', 'Nothing matches these filters for this period.', 72), action: S('text', 'Adjust the filters above and press Refresh.', 56) };
  const ar = { title: { ar: 'لا توجد بيانات بعد' }, body: { ar: 'لا يوجد ما يطابق هذه المرشحات في هذه الفترة.' }, action: { ar: 'عدّل المرشحات أعلاه ثم اضغط تحديث.' } };
  W('components/la/empty-state/component.html', `<div class="la-es is-{{state}}" data-ui="la-empty-state">\n  <div class="la-es-inner">\n    <span class="la-es-icon la-eico-{{icon}}" data-ui="la-empty-state.icon"></span>\n    <div class="la-es-title" data-ui="la-empty-state.title">{{title}}</div>\n    <div class="la-es-body" data-ui="la-empty-state.body">{{body}}</div>\n    <a class="la-es-action" data-ui="la-empty-state.action">{{action}}</a>\n  </div>\n</div>\n`);
  W('components/la/empty-state/slots.json', { slots, groups: { icon: 'icon (class token chart|clock|bag)' } });
  W('components/la/empty-state/texts.json', ar);
  W('components/la/empty-state/component.json', meta('la-empty-state', 'Empty state (icon, title, body, link action)', { states: ['no-data', 'background-report', 'no-purchases'], stateSlots: {
    'no-data': {}, 'background-report': { icon: 'clock', title: { en: 'Report is being prepared', ar: 'يجري إعداد التقرير' }, body: { en: 'This report runs in the background. It will appear here when it is ready.', ar: 'يعمل هذا التقرير في الخلفية وسيظهر هنا عند جاهزيته.' }, action: { en: 'Refresh in a minute.', ar: 'حدّث بعد دقيقة.' } },
    'no-purchases': { icon: 'bag', title: { en: 'No purchases yet', ar: 'لا توجد مشتريات بعد' }, body: { en: 'This member has not made a purchase in this period.', ar: 'لم يقم هذا العضو بأي عملية شراء في هذه الفترة.' }, action: { en: 'Record a purchase at the counter.', ar: 'سجّل عملية شراء عند الكاشير.' } } }, reference: 'ui-final/report-top-customers__desktop-light.png', notes: 'Reference has no icon; icon is an addition for video.' }));
}

/* ---------- css ---------- */
const fills = []; for (let n = 0; n <= 100; n += 5) fills.push(`.la-cg-fill-${n}{width:${n}%}`);
const css = `/* LA data components: heat-table, cat-heat-grid, report-table, empty-state. Sampled from rpt-cohorts, rs-p1a-heatmap, report-top-customers (1440x900 @1x). (est) = estimated. Generated by scripts/la-gen-data.mjs */
:root,[data-theme="light"]{--la-heat-0:transparent;--la-heat-1:#dcecfb;--la-heat-2:#b5ddfd;--la-heat-3:#8fc7f6;--la-heat-4:#61afef;--la-heat-5:#3f95e0;--la-heat-ink:#171717;
  --la-meter:#0075ff;--la-meter-track:#efefef;--la-meter-edge:#cfcfcf;--la-wash:#fafafb;--la-row-hover:#f7f7f7;--la-skel:#ededed;--la-ico:#999999;--la-link:#2b4acb;}
[data-theme="dark"]{--la-heat-1:#1b3248;--la-heat-2:#244c70;--la-heat-3:#2f6697;--la-heat-4:#3b82c4;--la-heat-5:#5aa0e0;--la-heat-ink:#f2f2f2;   /* (est) */
  --la-meter:#a3c9f5;--la-meter-track:#3a3a3a;--la-meter-edge:#555555;--la-wash:#1c1c1c;--la-row-hover:#202020;--la-skel:#2b2b2b;--la-ico:#676767;--la-link:#7d93f0;}
/* heat table */
.la-heat-table{width:1127px}
.la-heat-mode{display:flex;gap:6px;height:24px;align-items:center;font-size:var(--la-text-sm);color:var(--la-text-muted);padding-inline:16px}.la-heat-mode b{font-weight:500;color:var(--la-text)}
.la-heat-card{border:1px solid var(--la-border);border-radius:var(--la-radius-lg);padding:0 15px 8px 15px;margin-block-start:8px;overflow:hidden}
.la-heat-grid{border-collapse:separate;border-spacing:0 0;font-size:var(--la-text-sm);table-layout:fixed;width:1111px}
.la-heat-grid th{background:var(--la-subtle);font-weight:400;height:36px;text-align:start;padding:0 8px;color:var(--la-text)}
.la-heat-grid td{height:33px;padding:0 8px;border-block-end:1px solid var(--la-border);color:var(--la-text)}
.la-heat-grid .la-hc-idx{width:48px}.la-heat-grid .la-hc-rowh{width:120px}.la-heat-grid .la-hc-size{width:109px;text-align:end;padding-inline-end:18px}.la-heat-grid .la-hc-col{width:139px}.la-heat-grid td.la-hc-size{text-align:end}
.la-heat-grid td.la-hc{text-align:end;padding-inline:8px 12px;border-block-end-color:var(--la-bg);border-block-end-width:2px;border-inline-start:2px solid var(--la-bg);border-inline-end:0;background-clip:padding-box;color:var(--la-heat-ink)}
.la-heat-grid th.la-hc-col{text-align:end;padding-inline:8px 16px}
.la-hc.la-heat-0{background:transparent}.la-hc.la-heat-1{background:var(--la-heat-1)}.la-hc.la-heat-2{background:var(--la-heat-2)}.la-hc.la-heat-3{background:var(--la-heat-3)}.la-hc.la-heat-4{background:var(--la-heat-4)}.la-hc.la-heat-5{background:var(--la-heat-5)}
.is-cell-hover tr:nth-child(2) .la-hc:nth-child(6){box-shadow:inset 0 0 0 2px var(--la-text)}
.is-diagonal-highlight tr:nth-child(1) .la-hc:nth-child(4),.is-diagonal-highlight tr:nth-child(2) .la-hc:nth-child(5),.is-diagonal-highlight tr:nth-child(3) .la-hc:nth-child(6),.is-diagonal-highlight tr:nth-child(4) .la-hc:nth-child(7){box-shadow:inset 0 0 0 2px var(--la-primary);font-weight:600}
/* category heat grid */
.la-cat-heat-grid{width:746px}
.la-cg{width:100%;border-collapse:separate;border-spacing:0;border:1px solid var(--la-border);border-radius:var(--la-radius-lg);font-size:var(--la-text-sm);table-layout:fixed;overflow:hidden}
.la-cg th{background:var(--la-subtle);font-weight:600;padding:0 16px;height:45px;text-align:end;color:var(--la-text-muted)}
.la-cg thead th.la-cg-store{text-align:start;color:var(--la-text)}.la-cg thead th.la-cg-cat{color:var(--la-text)}
.la-cg tbody th.la-cg-store{background:var(--la-subtle);text-align:start;padding-inline:16px;color:var(--la-text-muted)}
.la-cg col,.la-cg .la-cg-store{width:82px}.la-cg .la-cg-cat,.la-cg td.la-cg-cell{width:162px}
.la-cg th:last-child,.la-cg td:last-child{width:176px;padding-inline-end:30px}
.la-cg td.la-cg-cell{padding:12px 16px 21px 17px;vertical-align:top;font-size:var(--la-text-base);line-height:19px;text-align:end;border-block-start:1px solid var(--la-border)}
.la-cg tbody tr:first-child td,.la-cg tbody tr:first-child th{border-block-start:0}
.la-cg-pct{color:var(--la-text-muted)}.la-cg-sup{display:none;color:var(--la-text-muted);font-size:var(--la-text-sm)}
.la-cg-body{display:block}
.la-cg-meter{height:6px;border:1px solid var(--la-meter-edge);border-radius:4px;background:var(--la-meter-track);margin-block-start:6px;overflow:hidden}.la-cg-fill{display:block;height:100%;margin:-1px;background:var(--la-meter);border-radius:3px}
${fills.join('')}
.is-suppressed-not-enough-data tr:nth-child(2) .la-cg-body,.is-suppressed-not-enough-data tr:nth-child(3) td:nth-child(3) .la-cg-body{display:none}
.is-suppressed-not-enough-data tr:nth-child(2) .la-cg-sup,.is-suppressed-not-enough-data tr:nth-child(3) td:nth-child(3) .la-cg-sup{display:block}
.is-suppressed-not-enough-data tr:nth-child(2) td{padding-block-end:13px}
.is-cell-hover tr:nth-child(1) td:nth-child(4){background:var(--la-row-hover)}
/* report table */
.la-report-table{width:1127px}
.la-rt{table-layout:auto}.la-rt th,.la-rt td{line-height:19.5px;padding:12px 16px}.la-rt th{height:45px;font-weight:600;color:var(--la-text-muted)}.la-rt tbody td{border-block-start:1px solid var(--la-border);height:44.5px}
.la-rt tbody tr:first-child td{border-block-start:1px solid var(--la-border)}
.la-rt .la-rt-num,.la-rt th.la-rt-num{text-align:end;width:160px}.la-rt-c1{width:200px}.la-rt-note{color:var(--la-text-muted)}
.la-rt-skel,.la-rt-empty{display:none}
.la-skel{display:block;height:12px;width:70%;border-radius:6px;background:var(--la-skel)}
.is-empty .la-rt-row,.is-loading .la-rt-row{display:none}.is-empty .la-rt-empty{display:table-row}.is-loading .la-rt-skel{display:table-row}
.la-rt-empty td{text-align:center;color:var(--la-text-muted);height:180px}
.is-row-hover tr:nth-child(2) td{background:var(--la-row-hover)}
/* empty state */
.la-es{width:100%;height:100%;min-height:760px;background:var(--la-wash);display:flex;align-items:center;justify-content:center;border-radius:var(--la-radius)}
.la-es-inner{display:flex;flex-direction:column;align-items:center;text-align:center;padding-block-end:120px}
.la-es-icon{width:36px;height:36px;margin-block-end:16px;background:var(--la-ico);-webkit-mask:var(--ico) center/contain no-repeat;mask:var(--ico) center/contain no-repeat}
.la-es-title{font-size:17px;font-weight:600;line-height:24px;color:var(--la-text)}
.la-es-body{font-size:var(--la-text-sm);line-height:20px;color:var(--la-text-muted);margin-block-start:4px}
.la-es-action{font-size:var(--la-text-sm);line-height:20px;color:var(--la-link);margin-block-start:6px}
.la-eico-chart{--ico:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 3v18h18'/%3E%3Cpath d='M8 17v-5M13 17V8M18 17v-9'/%3E%3C/svg%3E")}
.la-eico-clock{--ico:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='9'/%3E%3Cpath d='M12 7v5l3 2'/%3E%3C/svg%3E")}
.la-eico-bag{--ico:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 7h12l1 13H5L6 7z'/%3E%3Cpath d='M9 10V6a3 3 0 0 1 6 0v4'/%3E%3C/svg%3E")}
`;
W('tokens/css/la-desk-data.css', css); console.log('generated 4 components + la-desk-data.css');
