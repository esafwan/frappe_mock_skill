import { esc, ICON, injectAfterInput, setInputValue } from './util.mjs';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Pure date math (UTC), no clocks. y,m(0-11) -> weeks with leading/trailing days
function monthCells(y, m) {
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay();
  const n = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  const prev = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = [];
  for (let i = first - 1; i >= 0; i--) cells.push({ d: prev - i, o: true });
  for (let d = 1; d <= n; d++) cells.push({ d });
  while (cells.length % 7 || cells.length < 42) cells.push({ d: cells.length - first - n + 1, o: true });
  return cells.slice(0, 42);
}
const parse = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s ?? '')); return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null; };
const dmy = (p) => `${String(p.d).padStart(2, '0')}-${String(p.m + 1).padStart(2, '0')}-${p.y}`;
const hms = (v) => { const m = /(\d{2}):(\d{2})(?::(\d{2}))?/.exec(String(v ?? '')); return m ? { h: +m[1], mi: +m[2], s: +(m[3] || 0) } : { h: 0, mi: 0, s: 0 }; };
const two = (n) => String(n).padStart(2, '0');

function calendar(sel, view, withTime, t) {
  const cells = monthCells(view.y, view.m);
  const days = cells.map((c) => {
    const isSel = !c.o && sel && sel.y === view.y && sel.m === view.m && sel.d === c.d;
    return `<div class="datepicker--cell datepicker--cell-day${c.o ? ' -other-month-' : ''}${isSel ? ' -selected-' : ''}" data-date="${c.d}">${c.d}</div>`;
  }).join('');
  const time = withTime ? `<div class="datepicker--time"><span class="datepicker--time-current"><span class="datepicker--time-current-hours">${two(t.h)}</span><span class="datepicker--time-current-colon">:</span><span class="datepicker--time-current-minutes">${two(t.mi)}</span></span></div>` : '';
  return `<div class="datepicker active"><nav class="datepicker--nav"><div class="datepicker--nav-action" data-action="prev">${ICON('chevron-left')}</div><div class="datepicker--nav-title">${MONTHS[view.m]}, <i>${view.y}</i></div><div class="datepicker--nav-action" data-action="next">${ICON('chevron-right')}</div></nav><div class="datepicker--content"><div class="datepicker--days-names">${DOW.map((d) => `<div class="datepicker--day-name">${d}</div>`).join('')}</div><div class="datepicker--cells datepicker--cells-days">${days}</div></div>${time}</div>`;
}

/** Date / Datetime picker. ov: { value, view: {year, month(1-12)} } */
export function dateOpen(html, df, ctx, ov = {}) {
  const raw = ov.value ?? ctx.value ?? '';
  const sel = parse(raw);
  const v = ov.view ? { y: +ov.view.year, m: +ov.view.month - 1 } : sel ? { y: sel.y, m: sel.m } : { y: 1970, m: 0 };
  const withTime = df.fieldtype === 'Datetime';
  const t = hms(raw);
  let out = injectAfterInput(html, calendar(sel, v, withTime, t));
  if (sel) out = setInputValue(out, withTime ? `${dmy(sel)} ${two(t.h)}:${two(t.mi)}:${two(t.s)}` : dmy(sel));
  return out;
}

/** Time picker. ov: { value:"HH:MM:SS" } */
export function timeOpen(html, df, ctx, ov = {}) {
  const t = hms(ov.value ?? ctx.value);
  const col = (lbl, n, max, cur) => `<div class="timepicker-col" data-unit="${lbl}">${Array.from({ length: max }, (_, i) => `<div class="timepicker-cell${i === cur ? ' -selected-' : ''}">${two(i)}</div>`).join('')}</div>`;
  const popup = `<div class="datepicker active -only-timepicker-"><div class="datepicker--time">${''}</div>${col('hours', 0, 24, t.h)}${col('minutes', 0, 60, t.mi)}${col('seconds', 0, 60, t.s)}</div>`;
  return setInputValue(injectAfterInput(html, popup), `${two(t.h)}:${two(t.mi)}:${two(t.s)}`);
}
