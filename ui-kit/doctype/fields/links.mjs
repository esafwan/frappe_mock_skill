import { esc, wrapControl, formatValue } from '../lib/control.mjs';

const attrs = (df, ctx) => `data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" data-doctype="${esc(ctx.doctype || '')}"`;
const ro = (df) => (df.read_only ? ' disabled' : '');

const dynamicLink = (df, ctx) => {
  const v = formatValue(df, ctx.value, ctx);
  const target = (ctx.doc && ctx.doc[df.options]) || '';
  return wrapControl(df, {
    inputHtml: `<div class="link-field ui-front" style="position: relative;"><div class="awesomplete"><input type="text" class="input-with-feedback form-control" ${attrs(df, ctx)} data-target="${esc(target)}" data-options-field="${esc(df.options || '')}" placeholder="" autocomplete="off" role="combobox" aria-expanded="false"${ro(df)} value="${esc(v)}"></div></div>`,
    valueHtml: v ? `<a href="#" data-doctype="${esc(target)}" data-name="${esc(v)}">${esc(v)}</a>` : '',
  });
};

const tableMultiselect = (df, ctx) => {
  const child = ctx.loadMeta?.(df.options);
  const linkField = (child?.fields || []).find((f) => f.fieldtype === 'Link' && !f.hidden);
  const target = linkField?.options || '';
  const rows = Array.isArray(ctx.value) ? ctx.value : [];
  const pills = rows.map((r) => {
    const name = linkField ? r?.[linkField.fieldname] : Object.values(r || {}).find((x) => typeof x === 'string');
    if (!name) return '';
    return `<div class="tb-selected-value" data-value="${esc(name)}"><div class="btn-link-to-form"><span class="btn-link-to-form-text">${esc(name)}</span><span class="btn-remove"><svg class="icon icon-sm" aria-hidden="true"><use href="#icon-close"></use></svg></span></div></div>`;
  }).join('');
  const valuePills = rows.map((r) => esc(linkField ? r?.[linkField.fieldname] : '')).filter(Boolean).join(', ');
  return wrapControl(df, {
    inputHtml: `<div class="link-field ui-front form-control table-multiselect" style="position: relative;" data-child-doctype="${esc(df.options || '')}" data-link-field="${esc(linkField?.fieldname || '')}">${pills}<div class="awesomplete"><input type="text" class="input-with-feedback" ${attrs(df, ctx)} data-target="${esc(target)}" placeholder="" autocomplete="off" role="combobox" aria-expanded="false"${ro(df)}></div></div>`,
    valueHtml: valuePills,
  });
};

const autocomplete = (df, ctx) => {
  const v = formatValue(df, ctx.value, ctx);
  const list = String(df.options || '').split('\n').filter(Boolean);
  const ul = list.map((o) => `<li role="option" aria-selected="false">${esc(o)}</li>`).join('');
  return wrapControl(df, {
    inputHtml: `<div class="awesomplete"><input type="text" class="input-with-feedback form-control" ${attrs(df, ctx)} placeholder="" autocomplete="off" role="combobox" aria-expanded="false" data-list="${esc(list.join(','))}"${ro(df)} value="${esc(v)}"><ul hidden role="listbox">${ul}</ul></div>`,
    valueHtml: esc(v),
  });
};

export default {
  'Dynamic Link': dynamicLink,
  'Table MultiSelect': tableMultiselect,
  Autocomplete: autocomplete,
};
