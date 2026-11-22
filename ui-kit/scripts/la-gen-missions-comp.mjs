// Generates components/la/retail-missions/{component.html,states/*.html,slots.json,texts.json,component.json} (deterministic).
//   node scripts/la-gen-missions-comp.mjs
import fs from 'fs'; import path from 'path'; import { ROOT } from './lib.mjs';
const D = ROOT + 'components/la/retail-missions/'; fs.mkdirSync(D + 'states', { recursive: true });
const P = 'la-retail-missions';
// [slot, type, en sample, ar, maxLength]
const S = [
 ['desc','text','Product catalogue, categories and the rules that earn on them.','كتالوج المنتجات والفئات والقواعد التي تُكسب عليها.',80],
 ['tab1','text','Catalogue','الكتالوج',20],['tab2','text','Categories','الفئات',20],['tab3','text','Heatmap','الخريطة الحرارية',20],['tab4','text','Festival','المهرجان',20],
 ['tab5','text','Mapping inbox','صندوق الربط',20],['tab6','text','Missions','المهام',20],['tab7','text','Windows','النوافذ',20],['tab8','text','Retail settings','إعدادات التجزئة',24],
 ['title','text','New mission','مهمة جديدة',24],['lbl_name','text','Name','الاسم',20],['lbl_kind','text','Kind of mission','نوع المهمة',24],['lbl_earns','text','A member earns it by buying','يكسبها العضو بشراء',40],
 ['lbl_from','text','from','من',12],['lbl_names','text','Names, separated by commas','الأسماء، مفصولة بفواصل',40],['lbl_during','text','during','خلال',12],['lbl_and','text','and earns','ويكسب',16],
 ['lbl_upto','text','points, up to','نقطة، حتى',24],['lbl_per','text','time(s) per member.','مرة لكل عضو.',28],
 ['name','text','Dates and dairy habit','عادة التمر والألبان',28],['kind','text','Come back and buy again','عد واشتر مرة أخرى',28],['count','number','4','4',4],['unit','text','bills','فواتير',16],
 ['source','text','these categories','هذه الفئات',28],['names','text','Food/Dates, Food/Dairy','أغذية/تمور، أغذية/ألبان',60],['window','text','Ramadan 2026','رمضان 2026',24],['points','number','100','100',6],['cap','number','1','1',4],
 ['typed_points','number','10','10',6],['ph_name','text','Name this mission','سمّ هذه المهمة',28],['ph_kind','text','Choose a kind','اختر نوعًا',28],['ph_count','number','0','0',4],['ph_source','text','Choose what counts','اختر ما يُحتسب',28],['ph_window','text','Choose a window','اختر نافذة',24],
 ['summary','text','Buy 4 bills from Food/Dates, Food/Dairy during Ramadan 2026 and earn 100 points, up to 1 time(s).','اشترِ 4 فواتير من أغذية/تمور، أغذية/ألبان خلال رمضان 2026 واكسب 100 نقطة، حتى مرة واحدة.',120],
 ['summary_typing','text','Buy 4 bills from Food/Dates, Food/Dairy during Ramadan 2026 and earn 10 points, up to 1 time(s).','اشترِ 4 فواتير من أغذية/تمور، أغذية/ألبان خلال رمضان 2026 واكسب 10 نقطة، حتى مرة واحدة.',120],
 ['summary_empty','text','Fill in the fields above and your sentence appears here.','املأ الحقول أعلاه لتظهر جملتك هنا.',80],
 ['btn_check','text','Check against last year','تحقق مقابل العام الماضي',28],['btn_save','text','Save as draft','حفظ كمسودة',20],['notice','text','Saved as a draft. It will not run until you activate it.','تم الحفظ كمسودة. لن تعمل حتى تفعّلها.',64],
 ['k1_label','text','Would have qualified','كانوا سيستوفون الشرط',28],['k1_value','number','177','177',6],['k1_sub','text',"88.5% of last year's shoppers",'88.5% من متسوقي العام الماضي',40],
 ['k2_label','text','Completions','مرات الإنجاز',20],['k2_value','number','177','177',6],['k2_sub','text','Across everyone who qualified','عبر كل من استوفى الشرط',40],
 ['k3_label','text','Points cost','تكلفة النقاط',20],['k3_value','currency','1770','1770',16],['k3_sub','text','17,700 points at redeem value','17,700 نقطة بقيمة الاستبدال',40],
 ['k4_label','text','Funded by supplier','بتمويل المورّد',24],['k4_value','currency','708','708',16],['k4_sub','text','40% of the points cost','40% من تكلفة النقاط',40],
 ['h2','text','Missions','المهام',16],['col_mission','text','Mission','المهمة',16],['col_kind','text','Kind','النوع',16],['col_counts','text','What it counts','ما تحتسبه',20],['col_window','text','Window','النافذة',16],['col_reward','text','Reward','المكافأة',16],['col_status','text','Status','الحالة',16],
 ['r1_mission','text','Switch to the store tea','بدّل إلى شاي المتجر',28],['r1_kind','text','Switch to the store brand','بدّل إلى علامة المتجر',28],['r1_counts','text','Buy 2 units from Own Brand','اشترِ وحدتين من العلامة الخاصة',44],['r1_window','text','Ramadan 2026','رمضان 2026',20],['r1_reward','text','60 points','60 نقطة',16],['r1_status','text','Paused','متوقف',12],
 ['r2_mission','text','Try three aisles','جرّب ثلاثة ممرات',28],['r2_kind','text','Try several categories','جرّب عدة فئات',28],['r2_counts','text','Buy 3 categories from Food, Beverages, Fresh','اشترِ 3 فئات من أغذية، مشروبات، طازج',60],['r2_window','text','Ramadan 2026','رمضان 2026',20],['r2_reward','text','100 points','100 نقطة',16],['r2_status','text','Draft','مسودة',12],
 ['r3_mission','text','Dates and dairy habit','عادة التمر والألبان',28],['r3_kind','text','Come back and buy again','عد واشتر مرة أخرى',28],['r3_counts','text','Buy 4 bills from Food/Dates, Food/Dairy','اشترِ 4 فواتير من أغذية/تمور، أغذية/ألبان',60],['r3_window','text','Ramadan 2026','رمضان 2026',20],['r3_reward','text','150 points','150 نقطة',16],['r3_status','text','Active','نشطة',12],
 ['empty_title','text','No missions yet','لا توجد مهام بعد',24],['empty_body','text','Missions you save appear here.','تظهر هنا المهام التي تحفظها.',44],
 ['p_title','text','Mission progress','تقدم المهمة',24],['p_name','text','Dates and dairy habit','عادة التمر والألبان',28],['p_label','text','Completions so far','مرات الإنجاز حتى الآن',28],['current','number','68','68',6],['target','number','177','177',6],['p_pill','text','Active','نشطة',12],
];
const dg = (x) => String(x).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const slots = {}, texts = {}; for (const [k, type, en, ar, max] of S) { slots[k] = { type, sample: en, maxLength: max, where: 'text' }; if (ar !== en) texts[k] = { ar: dg(ar) }; }
const t = (k) => `{{${k}}}`; const id = (n) => `data-ui="${P}.${n}"`;
const tabs = `<div class="la-tabs" ${id('tabs')} data-state="active-6" role="tablist">${[1,2,3,4,5,6,7,8].map(i => `<a class="la-tab" ${id('tab-' + i)} role="tab">${t('tab' + i)}</a>`).join('')}</div>`;
const fld = (n, v, cls = '') => `<div class="la-fld${cls}" ${id('f-' + n)}>${v}</div>`;
function form(st) {
  const empty = st === 'empty', typing = st === 'typing';
  const F = (n, k, ph) => fld(n, empty ? t(ph) : t(k), empty ? ' is-empty' : '');
  const pts = typing ? fld('points', `${t('typed_points')}<span class="la-caret"></span>`, ' is-focus') : F('points', 'points', 'ph_count');
  const sum = empty ? `<p class="la-sf-summary is-hint" ${id('summary')}>${t('summary_empty')}</p>` : `<p class="la-sf-summary" ${id('summary')}>${t(typing ? 'summary_typing' : 'summary')}</p>`;
  return `<section class="la-card la-sf la-ms-form" ${id('form')}>
    <h3 class="la-sf-title" ${id('title')}>${t('title')}</h3>
    <div class="la-sf-pair"><label class="la-sf-col la-sf-col-a"><span class="la-lbl">${t('lbl_name')}</span>${F('name', 'name', 'ph_name')}</label><label class="la-sf-col la-sf-col-b"><span class="la-lbl">${t('lbl_kind')}</span>${F('kind', 'kind', 'ph_kind')}</label></div>
    <div class="la-sf-line is-tall"><span class="la-lbl">${t('lbl_earns')}</span></div>
    ${F('count', 'count', 'ph_count')}${fld('unit', t('unit'), empty ? ' is-empty' : '')}
    <div class="la-sf-line is-tall"><span class="la-lbl">${t('lbl_from')}</span></div>
    ${F('source', 'source', 'ph_source')}
    <div class="la-sf-line"><span class="la-lbl">${t('lbl_names')}</span></div>
    ${fld('names', empty ? '' : t('names'), ' la-fld-area')}
    <div class="la-sf-line"><span class="la-lbl">${t('lbl_during')}</span></div>
    ${F('window', 'window', 'ph_window')}
    <div class="la-sf-line is-tall"><span class="la-lbl">${t('lbl_and')}</span></div>
    ${pts}
    <div class="la-sf-line is-tall"><span class="la-lbl">${t('lbl_upto')}</span></div>
    ${F('cap', 'cap', 'ph_count')}
    <div class="la-sf-line"><span class="la-lbl">${t('lbl_per')}</span></div>
    ${sum}
    <div class="la-sf-actions"><span class="la-btn" ${id('btn-check')}>${t('btn_check')}</span><span class="la-btn is-primary" ${id('btn-save')}>${t('btn_save')}</span></div>
    ${st === 'draft' ? `<p class="la-ms-notice" ${id('notice')}>${t('notice')}</p>` : ''}
    ${['populated', 'active', 'paused', 'zero'].includes(st) ? `<div class="la-ms-kpis" ${id('result')}>
      <div class="la-ms-kpi" ${id('kpi-qualified')}><span class="la-ms-kl">${t('k1_label')}</span><span class="la-ms-kv" ${id('kpi-qualified-value')}>${t('k1_value')}</span><span class="la-ms-ks">${t('k1_sub')}</span></div>
      <div class="la-ms-kpi" ${id('kpi-completions')}><span class="la-ms-kl">${t('k2_label')}</span><span class="la-ms-kv" ${id('kpi-completions-value')}>${t('k2_value')}</span><span class="la-ms-ks">${t('k2_sub')}</span></div>
      <div class="la-ms-kpi" ${id('kpi-cost')}><span class="la-ms-kl">${t('k3_label')}</span><span class="la-ms-kv" ${id('kpi-cost-value')}>${t('k3_value')}</span><span class="la-ms-ks">${t('k3_sub')}</span></div>
      <div class="la-ms-kpi" ${id('kpi-funded')}><span class="la-ms-kl">${t('k4_label')}</span><span class="la-ms-kv" ${id('kpi-funded-value')}>${t('k4_value')}</span><span class="la-ms-ks">${t('k4_sub')}</span></div></div>` : ''}
  </section>`;
}
const PILL = { Paused: ' is-amber', Draft: '', Active: ' is-green' };
function row(n, status, hit) { const pc = PILL[status]; return `<tr class="la-tr${hit ? ' is-hit' : ''}" ${id('row-' + n)}><td ${id(`r${n}-mission`)}>${t(`r${n}_mission`)}</td><td ${id(`r${n}-kind`)}>${t(`r${n}_kind`)}</td><td ${id(`r${n}-counts`)}>${t(`r${n}_counts`)}</td><td ${id(`r${n}-window`)}>${t(`r${n}_window`)}</td><td ${id(`r${n}-reward`)}>${t(`r${n}_reward`)}</td><td><span class="la-pill${pc}" ${id(`r${n}-status`)}>${t(`r${n}_status`)}</span></td></tr>`; }
function right(st) {
  const head = `<h2 class="la-ms-h2" ${id('h2')}>${t('h2')}</h2>`;
  if (st === 'empty') return `<div class="la-ms-right">${head}<div class="la-inbox-empty" ${id('empty')}><div class="la-inbox-empty-title">${t('empty_title')}</div><div class="la-inbox-empty-body">${t('empty_body')}</div></div></div>`;
  const stat = { populated: ['Paused', 'Draft', 'Active'], zero: ['Paused', 'Draft', 'Active'], typing: ['Paused', 'Draft', 'Active'], draft: ['Paused', 'Draft', 'Draft'], active: ['Paused', 'Draft', 'Active'], paused: ['Paused', 'Draft', 'Paused'] }[st];
  const thead = `<thead><tr ${id('head')}>${['mission', 'kind', 'counts', 'window', 'reward', 'status'].map(c => `<th ${id('col-' + c)}>${t('col_' + c)}</th>`).join('')}</tr></thead>`;
  const prog = (st === 'active' || st === 'paused') ? `<section class="la-card la-ms-prog" ${id('progress')}><div class="la-ms-prog-head"><span class="la-ms-prog-title" ${id('progress-title')}>${t('p_title')}</span><span class="la-pill${st === 'paused' ? ' is-amber' : ' is-green'}" ${id('progress-pill')}>${st === 'paused' ? t('r1_status') : t('p_pill')}</span></div><div class="la-ms-prog-name" ${id('progress-name')}>${t('p_name')}</div><div class="la-pmeter"><div class="la-pmeter-row"><span ${id('progress-label')}>${t('p_label')}</span><span class="la-pmeter-nums" ${id('progress-nums')}><span ${id('progress-current')}>${t('current')}</span> / <span ${id('progress-target')}>${t('target')}</span></span></div><span class="la-bar" data-fill="{{fill__raw}}" ${id('progress-bar')}><span class="la-bar-fill" ${id('progress-fill')}></span></span></div></section>` : '';
  return `<div class="la-ms-right">${head}<div class="la-tablewrap" ${id('table')}><table class="la-table la-ms-table">${thead}<tbody>${stat.map((s, i) => row(i + 1, s, st === 'draft' && i === 2)).join('')}</tbody></table></div>${prog}</div>`;
}
const ST = ['populated', 'typing', 'empty', 'zero', 'draft', 'active', 'paused'];
const page = (st) => `<div class="la-ms" ${id('')} data-state="${st}">
  <p class="la-inbox-desc" ${id('desc')}>${t('desc')}</p>
  ${tabs}
  <div class="la-ms-cols">${form(st)}${right(st)}</div>
</div>`.replace(`data-ui="${P}."`, `data-ui="${P}"`);
fs.writeFileSync(D + 'component.html', page('populated') + '\n');
for (const s of ST) fs.writeFileSync(D + `states/${s}.html`, page(s) + '\n');
fs.writeFileSync(D + 'slots.json', JSON.stringify({ slots }, null, 1) + '\n'); fs.writeFileSync(D + 'texts.json', JSON.stringify(texts, null, 1) + '\n');
fs.writeFileSync(D + 'component.json', JSON.stringify({ id: P, name: 'Retail missions (tabs, new-mission sentence form, check-against-last-year results, missions table, progress)', system: 'loyal-arrow-desk', kind: 'page-body', shell: true, shellState: 'section-expanded', viewport: { w: 1440, h: 900 },
  css: ['la-desk-inbox.css', 'la-desk-nav.css', 'la-desk-admin.css', 'la-widgets.css', 'la-desk-missions.css'], states: ST, defaultState: 'populated', reference: 'rs-p1b-missions-ui/after_missions_1440_light.png',
  notes: 'Interaction targets: f-name f-kind f-count f-unit f-source f-names f-window f-points f-cap (type into), summary, btn-check (Check against last year), btn-save (Save as draft), result/kpi-*, table/row-n/rN-status, progress/progress-bar/progress-fill (mission progress; active+paused only), notice (draft). populated = reference (paused, draft, active rows). Data: data/<region>/missions.json via scripts/la-pages-missions.mjs.' }, null, 1) + '\n');
