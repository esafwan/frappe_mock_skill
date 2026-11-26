import { esc, formatValue } from '../lib/control.mjs';
import { wrapFrappe, descHtml } from './base.mjs';

// Markup follows frappe v16: html.js (ControlHTML puts content straight into the control wrapper,
// no label/form-group), heading.js (<h4>label</h4>), button.js (ControlData; label hidden,
// <button class="btn btn-xs btn-default"> in .control-input), image.js (body div + missing-image),
// ControlReadOnly = ControlData.
const nm = (df) => esc(df.fieldname);
const lbl = (df) => esc(df.label ?? df.fieldname);
const brk = () => '';
const ic = (n, size = 'sm') => `<svg class="icon icon-${size}" style="" aria-hidden="true"><use class="" href="#icon-${n}"></use></svg>`;

const BTN_COLORS = { Default: 'btn-default', Primary: 'btn-primary', Info: 'btn-info', Success: 'btn-success', Warning: 'btn-warning', Danger: 'btn-danger' };

export default {
  HTML: (df, ctx) => `<div class="frappe-control" data-fieldtype="HTML" data-fieldname="${nm(df)}">${df.options || ctx.value || ''}</div>`,
  Heading: (df) => `<div class="frappe-control" data-fieldtype="Heading" data-fieldname="${nm(df)}"><h4>${lbl(df)}</h4></div>`,
  Button: (df, ctx) => {
    const type = df.button_color ? (BTN_COLORS[df.button_color] || 'btn-default') : (df.primary ? 'btn-primary' : 'btn-default');
    const size = df.btn_size ? `btn-${esc(df.btn_size)}` : 'btn-xs';
    const d = descHtml(df);
    return `<div class="frappe-control input-max-width" data-fieldtype="Button" data-fieldname="${nm(df)}">
				<div class="form-group horizontal">
					<div class="clearfix hide">
						<label class="control-label" style="padding-right: 5px;">&nbsp;</label>
						<span class="help"></span>
					</div>
					<div class="control-input-wrapper">
						<div class="control-input"><button class="btn ${size} ${type}" title="${esc(df.title || df.label || df.fieldname)}" data-fieldtype="Button" data-fieldname="${nm(df)}">${df.icon ? ic(esc(df.icon)) : ''}${lbl(df)}</button></div>
						<div class="hide"></div>
						<div class="help-box small text-extra-muted${d ? '' : ' hide'}">${d}</div>
					</div>
				</div>
			</div>`;
  },
  'Read Only': (df, ctx) => {
    const v = formatValue(df, ctx.value, ctx);
    // read mode: .control-input hidden, .control-value shown
    return wrapFrappe(df, {
      inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control" data-fieldtype="Read Only" data-fieldname="${nm(df)}" placeholder="" disabled value="${esc(v)}">`,
      inputAttrs: ' style="display: none;"',
      valueHtml: esc(v),
      hideValue: false,
    });
  },
  Image: (df, ctx) => {
    const src = ctx.doc?.[df.options];
    return `<div class="frappe-control" data-fieldtype="Image" data-fieldname="${nm(df)}" style="margin: 0px;"><div style="margin-bottom: 10px;">${src ? `<img src='${esc(src)}' class="img-responsive" style="max-width: 100%;">` : `<div class='missing-image'>${ic('ban', 'md')}</div>`}</div><div class="clearfix"></div></div>`;
  },
  Fold: brk, 'Section Break': brk, 'Column Break': brk, 'Tab Break': brk,
};
