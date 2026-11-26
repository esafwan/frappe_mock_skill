import { esc, wrapControl } from '../lib/control.mjs';

const attrs = (df, ctx) => `data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" data-doctype="${esc(ctx.doctype || '')}"`;
const ro = (df) => (df.read_only ? ' disabled' : '');
const dmy = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s); return m ? `${m[3]}-${m[2]}-${m[1]}` : s; };

function input(df, ctx, v) {
  return wrapControl(df, {
    inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control${df.bold ? ' bold' : ''}" ${attrs(df, ctx)} placeholder=""${ro(df)} value="${esc(v)}">`,
    valueHtml: esc(v),
  });
}

export default {
  Datetime: (df, ctx) => {
    const raw = ctx.value == null ? '' : String(ctx.value);
    const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)/.exec(raw);
    return input(df, ctx, m ? `${dmy(m[1])} ${m[2]}` : dmy(raw));
  },
  Time: (df, ctx) => input(df, ctx, ctx.value == null ? '' : String(ctx.value)),
  'Date Range': (df, ctx) => {
    let v = ctx.value;
    if (Array.isArray(v)) v = v.map((x) => dmy(String(x))).join(' to ');
    else v = String(v ?? '').split(',').map((x) => dmy(x.trim())).filter(Boolean).join(' to ');
    return input(df, ctx, v);
  },
};
