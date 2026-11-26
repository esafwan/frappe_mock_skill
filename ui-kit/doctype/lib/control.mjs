import * as FMT from '../../kit-lib/format.mjs';
export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const CURRENCY = { 'en-IN': 'INR', 'en-US': 'USD', 'en-GB': 'GBP', 'ar-AE': 'AED', 'ar-SA': 'SAR', 'de-DE': 'EUR' };

const DEP_STYLE = '<style>.dep-unknown{outline:1px dashed #b8bcc2;outline-offset:2px;border-radius:4px}</style>';

export function wrapControl(df, { inputHtml = '', valueHtml = '', extraClass = '' } = {}) {
  const reqd = df.reqd ? ' reqd' : '';
  const cls = `frappe-control input-max-width${extraClass ? ' ' + extraClass : ''}${df._dep_unknown ? ' dep-unknown' : ''}`;
  const fn = esc(df.fieldname), ft = esc(df.fieldtype);
  return `${DEP_STYLE}<div class="${cls}" data-fieldtype="${ft}" data-fieldname="${fn}">
				<div class="form-group horizontal">
					<div class="clearfix">
						<label class="control-label${reqd}" style="padding-right: 5px;">${esc(df.label ?? df.fieldname)}</label>
						<span class="help"></span>
					</div>
					<div class="control-input-wrapper">
						<div class="control-input">${inputHtml}</div>
						<div class="control-value like-disabled-input hide${df.bold ? ' bold' : ''}">${valueHtml}</div>
						<div class="help-box small text-extra-muted${df.description ? '' : ' hide'}">${df.description || ''}</div>
					</div>
				</div>
			</div>`;
}

function parseLocale(l) {
  if (l && typeof l === 'object') return { locale: l.locale || 'en-IN', currency: l.currency || CURRENCY[l.locale] || 'INR' };
  const locale = l || 'en-IN';
  return { locale, currency: CURRENCY[locale] || 'INR' };
}

// ctx.system (System Settings, kit-lib/format.mjs) overrides the Intl locale path for numbers and dates.
export function formatValue(df, value, ctx = {}) {
  if (value === undefined || value === null || value === '') return '';
  const S = ctx.system;
  if (S) {
    switch (df.fieldtype) {
      case 'Currency': {
        if (Number.isNaN(Number(value))) return String(value);
        const { locale, currency } = parseLocale(ctx.locale);
        const cur = df.options && /^[A-Z]{3}$/.test(df.options) ? df.options : currency;
        return FMT.currencyAround(value, S, locale, cur);
      }
      case 'Float': case 'Percent': return Number.isNaN(Number(value)) ? String(value) : FMT.formatNumber(value, S, df.precision != null && df.precision !== '' ? Number(df.precision) : S.float_precision, { trim: true });
      case 'Int': return Number.isNaN(Number(value)) ? String(value) : FMT.formatInt(value, S);
      case 'Date': return FMT.formatDate(value, S);
      case 'Datetime': return FMT.formatDatetime(value, S);
      case 'Time': return FMT.formatTime(value, S);
      default: break;
    }
  }
  const { locale, currency } = parseLocale(ctx.locale);
  switch (df.fieldtype) {
    case 'Currency': {
      const n = Number(value);
      if (Number.isNaN(n)) return String(value);
      return new Intl.NumberFormat(locale, { style: 'currency', currency: df.options && /^[A-Z]{3}$/.test(df.options) ? df.options : currency }).format(n);
    }
    case 'Float': case 'Int': case 'Percent':
      return Number.isNaN(Number(value)) ? String(value) : new Intl.NumberFormat(locale).format(Number(value));
    case 'Date': {
      const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
      return m ? `${m[3]}-${m[2]}-${m[1]}` : String(value);
    }
    case 'Check': return value ? '1' : '0';
    default: return String(value);
  }
}
