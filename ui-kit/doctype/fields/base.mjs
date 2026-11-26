import { esc, formatValue } from '../lib/control.mjs';
import { renderTable } from './table.mjs';

// Frappe renders df.description as HTML (base_input.set_description: help_box.html(description)).
export const descHtml = (df) => (df.description ? String(df.description) : '');

// Only these types show a numeric/token default when the doc has no value (Frappe sets defaults at doc
// creation per type; for Data/Select/Text a numeric "0" default is not a real display value).
const NUMERIC_DEFAULT_TYPES = new Set(['Check', 'Int', 'Float', 'Currency', 'Percent']);
export function effectiveValue(df, ctx) {
  if (ctx.value !== undefined && ctx.value !== null) return ctx.value;
  const d = df.default;
  if (d === undefined || d === null || d === '') return undefined;
  if (NUMERIC_DEFAULT_TYPES.has(df.fieldtype)) return d;
  if (/^\s*-?\d+(\.\d+)?\s*$/.test(String(d))) return undefined;
  if (/^(Today|Now|__user|__today)$/i.test(String(d))) return undefined;
  return d;
}

// Mirrors base_input.make_wrapper(). opts.horizontal (class static horizontal: true for Data-like,
// false for Text/Code/Geolocation), opts.valueClass extra classes on .control-value, opts.hideValue,
// opts.beforeInputWrapper / afterInputWrapper (elements the control appends to $input_wrapper), opts.hideLabel.
export function wrapFrappe(df, { inputHtml = '', valueHtml = '', horizontal = true, valueClass = '', valueAttrs = '', hideValue = true, inputAttrs = '', inputWrapperPre = '', inputWrapperPost = '', hideLabel = false, wrapperAttrs = '' } = {}) {
  const reqd = df.reqd ? ' reqd' : '';
  const d = descHtml(df);
  return `<div class="frappe-control${horizontal ? ' input-max-width' : ''}" data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}"${wrapperAttrs}>
				<div class="form-group${horizontal ? ' horizontal' : ''}">
					<div class="clearfix${hideLabel ? ' hide' : ''}">
						<label class="control-label${reqd}" style="padding-right: 5px;">${esc(df.label ?? df.fieldname)}</label>
						<span class="help"></span>
					</div>
					<div class="control-input-wrapper">${inputWrapperPre}
						<div class="control-input"${inputAttrs}>${inputHtml}</div>
						<div class="control-value like-disabled-input${valueClass ? ' ' + valueClass : ''}${hideValue ? ' hide' : ''}${df.bold ? ' bold' : ''}"${valueAttrs}>${valueHtml}</div>
						<div class="help-box small text-extra-muted${d ? '' : ' hide'}">${d}</div>${inputWrapperPost}
					</div>
				</div>
				<span class="tooltip-content">${esc(df.fieldname)}</span>
			</div>`;
}
const wrapControl = wrapFrappe;

const attrs = (df, ctx) => `data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" data-doctype="${esc(ctx.doctype || '')}"`;
const val = (df, ctx) => formatValue(df, ctx.value, ctx);
const ro = (df) => (df.read_only ? ' disabled' : '');
const valAttr = (v) => (v === undefined || v === null || v === '' ? '' : ` value="${esc(v)}"`);
const maxlen = (df) => ` maxlength="${df.length || 140}"`;

function textInput(df, ctx, extra = '') {
  const v = val(df, ctx);
  return wrapControl(df, {
    inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control${df.bold ? ' bold' : ''}"${maxlen(df)} ${attrs(df, ctx)} placeholder=""${ro(df)}${valAttr(v)}${extra ? ' ' + extra : ''}>`,
    valueHtml: esc(v),
  });
}

function table(df, ctx) {
  const child = ctx.loadMeta?.(df.options);
  let cols = child ? (child.fields || []).filter((f) => f.in_list_view && !f.hidden && !/Break$/.test(f.fieldtype)) : [];
  if (child && !cols.length) cols = (child.fields || []).filter((f) => !f.hidden && !/Break$/.test(f.fieldtype)).slice(0, 4);
  const rows = Array.isArray(ctx.value) ? ctx.value : [];
  // Frappe grid: child df.columns (1-10 units); fallback 2; fields fit 8 units (+1 index +1 edit = 10)
  const sized = [];
  let used = 0;
  for (const c of cols) {
    const n = Math.min(10, Math.max(1, parseInt(c.columns, 10) || 2));
    if (used + n > 8) { if (sized.length) continue; }
    used += n;
    sized.push({ ...c, _w: n });
  }
  cols = sized;
  const NUM = /Currency|Float|Int|Percent/;
  const px = (c) => { const w = parseInt(c.width, 10); if (w > 0) return w; return NUM.test(c.fieldtype) ? 100 : c._w >= 3 ? 200 : 140; };
  const cs = (c) => `style="flex: 1 0 ${px(c)}px; width: ${px(c)}px;"`;
  const last = (i) => (i === cols.length - 1 ? ' grid-data-last' : '');
  const lead = (txt) => `<div class="row-check sortable-handle col">
					<input type="checkbox" class="grid-row-check" tabindex="-1" style="">
				</div><div class="row-index sortable-handle grid-static-col col">
					<span>${txt}</span>
				</div>`;
  const edit = (head) => head ? '<div class="col grid-static-col pointer"><a><svg class="icon  icon-sm" style="filter: opacity(0.5)" aria-hidden="true"><use class="" href="#icon-settings"></use></svg></a></div>' : '<div class="col"><div class="btn-open-row" data-toggle="tooltip" data-placement="right" title="" data-original-title="Edit"><a><svg class="icon  icon-xs" style="" aria-hidden="true"><use class="" href="#icon-pencil"></use></svg></a></div></div>';
  const colHead = cols.map((c, i) => `<div class="col grid-static-col${NUM.test(c.fieldtype) ? ' text-right' : ''}${last(i)}" ${cs(c)} data-fieldname="${esc(c.fieldname)}" data-fieldtype="${esc(c.fieldtype)}" title="${esc(c.label)}"${i === 0 ? ' tabindex="0"' : ''}><div class="field-area" style="display: none;"></div><div class="static-area ellipsis${c.reqd ? ' reqd' : ''}">${esc(c.label)}</div><div class="grid-col-resize-handle" title=""></div></div>`).join('');
  const body = rows.map((r, i) => `<div class="grid-row" data-name="row-${i + 1}" data-idx="${i + 1}"><div class="data-row row m-0">${lead(i + 1)}${cols.map((c, j) => `<div class="col grid-static-col${NUM.test(c.fieldtype) ? ' text-right' : ''} bold${last(j)}" ${cs(c)} data-fieldname="${esc(c.fieldname)}" data-fieldtype="${esc(c.fieldtype)}"><div class="field-area" style="display: none;"></div><div class="static-area ellipsis${c.reqd ? ' reqd' : ''}">${esc(formatValue(c, r?.[c.fieldname], ctx))}</div></div>`).join('')}${edit(false)}</div></div>`).join('');
  return `<div class="frappe-control form-group" data-fieldtype="Table" data-fieldname="${esc(df.fieldname)}"><span class="tooltip-content">${esc(df.fieldname)}</span><div class="grid-field">
				<label class="control-label">${esc(df.label ?? df.fieldname)}</label>
				<span class="help"></span>
				<p class="text-muted small grid-description" style="display: none;"></p>
				<div class="grid-custom-buttons"></div>
				<div class="form-grid-container">
					<div class="form-grid">
						<div class="grid-heading-row"><div class="grid-row"><div class="data-row row m-0">${lead('No.')}${colHead}${edit(true)}</div></div></div>
						<div class="grid-body"><div class="rows">${body}</div>
						<div class="grid-empty text-center text-extra-muted${rows.length ? ' hidden hide' : ''}">No rows</div></div>
					</div>
				</div>
				<div class="small form-clickable-section grid-footer"><div class="flex justify-between"><div class="grid-buttons"><button type="button" class="btn btn-xs btn-secondary grid-add-row">Add row</button></div></div></div>
			</div></div>`;
}

export default {
  Data: (df, ctx) => textInput(df, ctx),
  Link: (df, ctx) => {
    const v = val(df, ctx);
    return wrapControl(df, {
      inputHtml: `<div class="link-field ui-front" style="position: relative;"><div class="awesomplete"><input type="text" class="input-with-feedback form-control${df.bold ? ' bold' : ''}"${maxlen(df)} ${attrs(df, ctx)} data-target="${esc(df.options || '')}" placeholder="" autocomplete="off" role="combobox" aria-expanded="false"${ro(df)}${valAttr(v)}></div></div>`,
      valueHtml: v ? `<a href="#" data-doctype="${esc(df.options || '')}" data-name="${esc(v)}">${esc(v)}</a>` : '',
    });
  },
  Select: (df, ctx) => {
    const opts = String(df.options || '').split('\n');
    const cur = effectiveValue(df, ctx) ?? '';
    const o = opts.map((x) => `<option value="${esc(x)}"${x === cur ? ' selected=""' : ''}>${esc(x)}</option>`).join('');
    return wrapControl(df, {
      inputHtml: `<select autocomplete="off" class="input-with-feedback form-control ellipsis${df.bold ? ' bold' : ''}"${maxlen(df)} ${attrs(df, ctx)} placeholder=""${ro(df)}>${o}</select><div class="select-icon "><svg class="icon  icon-sm" style="" aria-hidden="true"><use class="" href="#icon-chevrons-up-down"></use></svg></div>`.replace(/^/, ''),
      valueHtml: esc(cur), extraClass: '',
    }).replace('<div class="control-input">', '<div class="control-input flex align-center">');
  },
  Date: (df, ctx) => textInput(df, ctx),
  Check: (df, ctx) => {
    const cv = effectiveValue(df, ctx);
    const checked = cv && String(cv) !== '0' ? ' checked=""' : '';
    return `<div class="form-group frappe-control input-max-width" data-fieldtype="Check" data-fieldname="${esc(df.fieldname)}">
			<div class="checkbox">
				<label>
					<span class="input-area"><input type="checkbox" autocomplete="off" class="input-with-feedback" ${attrs(df, ctx)} placeholder=""${checked}${ro(df)}></span>
					<span class="disp-area hide"><input type="checkbox" disabled="" class="disabled-deselected"></span>
					<span class="label-area">${esc(df.label ?? df.fieldname)}</span>
					<span class="ml-1 help"></span>
				</label>
				<p class="help-box small text-extra-muted">${descHtml(df)}</p>
			</div>
			<span class="tooltip-content">${esc(df.fieldname)}</span>
		</div>`;
  },
  Table: renderTable,
};
