import { esc, wrapControl, formatValue } from '../lib/control.mjs';

const attrs = (df, ctx) => `data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" data-doctype="${esc(ctx.doctype || '')}"`;
const ro = (df) => (df.read_only ? ' disabled' : '');
const cls = (df) => `input-with-feedback form-control${df.bold ? ' bold' : ''}`;
const ml = (df) => (df.length ? ` maxlength="${df.length}"` : '');

function icon(name) {
  return `<svg class="icon icon-sm" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

// Data with options Email/URL/Name/Barcode: text input + type-specific value display
function dataOpt(option, { valueFn } = {}) {
  return (df, ctx) => {
    const v = formatValue(df, ctx.value, ctx);
    return wrapControl(df, {
      inputHtml: `<input type="text" autocomplete="off" class="${cls(df)}"${ml(df)} ${attrs(df, ctx)} data-options="${option}" placeholder=""${ro(df)} value="${esc(v)}">`,
      valueHtml: valueFn ? valueFn(v) : esc(v),
    });
  };
}

const Password = (df, ctx) => {
  const has = ctx.value !== undefined && ctx.value !== null && ctx.value !== '';
  const shown = has ? '*'.repeat(Math.min(String(ctx.value).length, 12) || 8) : '';
  return wrapControl(df, {
    inputHtml: `<input type="password" autocomplete="new-password" class="${cls(df)}"${ml(df)} ${attrs(df, ctx)} placeholder=""${ro(df)} value="${esc(shown)}"><span class="toggle-password text-muted">${icon('eye')}</span><div class="strength-indicator hide"></div><div class="strength-message hide"></div>`,
    valueHtml: esc(shown),
  });
};

const Phone = (df, ctx) => {
  const v = formatValue(df, ctx.value, ctx);
  return wrapControl(df, {
    inputHtml: `<div class="phone-picker"><div class="input-group"><div class="selected-phone"><span class="country">${icon('phone')}</span></div><input type="text" autocomplete="off" class="${cls(df)}"${ml(df)} ${attrs(df, ctx)} data-options="Phone" placeholder="" maxlength="20"${ro(df)} value="${esc(v)}"></div></div>`,
    valueHtml: v ? `<a href="tel:${esc(v)}">${esc(v)}</a>` : '',
  });
};

export default {
  Password,
  Phone,
  'Data:Email': dataOpt('Email', { valueFn: (v) => (v ? `<a href="mailto:${esc(v)}">${esc(v)}</a>` : '') }),
  'Data:URL': dataOpt('URL', { valueFn: (v) => (v ? `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(v)}</a>` : '') }),
  'Data:Phone': Phone,
  'Data:Name': dataOpt('Name'),
  'Data:Barcode': (df, ctx) => {
    const v = formatValue(df, ctx.value, ctx);
    return wrapControl(df, {
      inputHtml: `<input type="text" autocomplete="off" class="${cls(df)}"${ml(df)} ${attrs(df, ctx)} data-options="Barcode" placeholder=""${ro(df)} value="${esc(v)}">`,
      valueHtml: v ? `<div class="barcode-wrapper"><svg class="barcode-svg" data-value="${esc(v)}"></svg><div class="text-muted small">${esc(v)}</div></div>` : '',
    });
  },
};
