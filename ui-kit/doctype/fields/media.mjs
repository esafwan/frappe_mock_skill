import { esc } from '../lib/control.mjs';
import { wrapFrappe } from './base.mjs';

// Markup follows frappe v16 controls: attach.js, attach_image.js, signature.js, barcode.js,
// geolocation.js, color.js (all ControlData subclasses; Geolocation is horizontal=false).
const attrs = (df, ctx) => `data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" data-doctype="${esc(ctx.doctype || '')}"`;
const ro = (df) => (df.read_only ? ' disabled' : '');
const ic = (n, size = 'sm') => `<svg class="icon icon-${size}" style="" aria-hidden="true"><use class="" href="#icon-${n}"></use></svg>`;
// attach.set_input: value may be "FILENAME,DATAURL" (rare); show filename, link to value
const fileName = (v) => String(v ?? '');

function attachBase(df, ctx) {
  const v = ctx.value;
  const has = v !== undefined && v !== null && v !== '';
  // $value is prepended after $input, so it comes first in .control-input
  const value = `<div class="attached-file flex justify-between align-center"${has ? '' : ' style="display: none;"'}>
				<div class="ellipsis">
				${ic('link')}
					<a class="attached-file-link" target="_blank"${has ? ` href="${esc(v)}"` : ''}>${has ? esc(fileName(v)) : ''}</a>
				</div>
				<div class="flex" style="align-items: center">
					<a class="btn btn-xs btn-default" data-action="clear_attachment">Clear</a>
				</div>
			</div>`;
  const input = `${value}<button class="btn btn-default btn-sm btn-attach"${has ? ' style="display: none;"' : ''} ${attrs(df, ctx)}${ro(df)}>Attach</button>`;
  return wrapFrappe(df, { inputHtml: input, valueHtml: has ? `<div class="attached-file flex justify-between align-center"><div class="ellipsis"><a target="_blank" href="${esc(v)}">${esc(fileName(v))}</a></div></div>` : '' });
}

// ControlAttachImage = ControlAttach (+ hover popover preview, no inline preview in the control)
const attachImage = attachBase;

// signature.js: .signature-field (jSignature pad + reset button) and .signature-display (image or
// missing-image placeholder) are prepended to $input_wrapper; .control-input is hidden.
function signature(df, ctx) {
  const v = ctx.value;
  const pre = `<div class="signature-display">
			<div class="missing-image attach-missing-image"${v ? ' style="display: none;"' : ''}>
				${ic('ban', 'md')}</i>
			</div>${v ? `<img class="img-responsive attach-image-display" src="${esc(v)}">` : `<img class="img-responsive attach-image-display" style="display: none;">`}</div>`;
  const pad = `<div class="signature-field"><canvas class="jSignature" height="200" style="width: 100%; height: 200px; background-color: var(--control-bg);"></canvas><div class="signature-btn-row">
						<a href="#" type="button" class="signature-reset btn icon-btn">
							${ic('refresh-cw')}
						</a>
					</div></div>`;
  return wrapFrappe(df, {
    inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control" ${attrs(df, ctx)} placeholder=""${ro(df)} value="">`,
    inputAttrs: ' style="display: none;"',
    inputWrapperPre: `${pad}${pre}`,
    valueHtml: '',
  });
}

function barcodeSvg(text) {
  // deterministic pseudo-bars from the text (display only, not scannable)
  const s = String(text || '');
  let x = 4, bars = '', seed = 0;
  for (const ch of s || 'barcode') seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  for (let i = 0; i < 40; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const w = 1 + (seed >> 16) % 3;
    if (i % 2 === 0) bars += `<rect x="${x}" y="4" width="${w}" height="52" fill="currentColor"/>`;
    x += w + 1;
  }
  return `<svg height="80" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${x + 4} 60" xmlns="http://www.w3.org/2000/svg" data-barcode-value="${esc(s)}" role="img" aria-label="${esc(s)}">${bars}</svg>`;
}

// barcode.js: text input in .control-input + <div class="barcode-wrapper"><svg></div> appended to $input_wrapper
function barcode(df, ctx) {
  const v = ctx.value;
  const has = v !== undefined && v !== null && v !== '';
  return wrapFrappe(df, {
    inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control" ${attrs(df, ctx)} placeholder=""${ro(df)} value="${esc(has ? v : '')}">`,
    inputWrapperPost: `<div class="barcode-wrapper">${has ? barcodeSvg(v) : '<svg height=80></svg>'}</div>`,
    valueHtml: esc(has ? v : ''),
  });
}

// geolocation.js: horizontal=false, .control-input gets "hidden", disp area (no like-disabled-input,
// display:block) holds .map-wrapper.border > map div (leaflet fills it at runtime).
function geolocation(df, ctx) {
  const id = `map-${esc(df.fieldname)}`;
  return wrapFrappe(df, {
    horizontal: false,
    inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control" ${attrs(df, ctx)} placeholder=""${ro(df)} value="${esc(typeof ctx.value === 'string' ? ctx.value : ctx.value ? JSON.stringify(ctx.value) : '')}">`,
    inputAttrs: ' class="hidden"',
    valueHtml: `<div class="map-wrapper border"><div id="${id}" class="leaflet-container leaflet-touch leaflet-fade-anim" style="min-height: 400px; z-index: 1; max-width:100%"></div></div>`,
    hideValue: false,
  }).replace('<div class="control-input" class="hidden">', '<div class="control-input hidden">').replace('control-value like-disabled-input', 'control-value').replace('<div class="control-value"', '<div class="control-value" style="display: block;"').replace('style="display: block;" bold', 'bold');
}

// color.js: input (placeholder "Choose a color") + <div class="selected-color"> inserted after it
function color(df, ctx) {
  const v = ctx.value ?? '';
  const input = `<input type="text" autocomplete="off" class="input-with-feedback form-control" ${attrs(df, ctx)} placeholder="Choose a color"${ro(df)} value="${esc(v)}"><div class="selected-color${v ? '' : ' no-value'}" style="background-color: ${v ? esc(v) : 'transparent'};"></div>`;
  return wrapFrappe(df, { inputHtml: input, valueHtml: v ? `<span class="selected-color" style="display:inline-block;width:12px;height:12px;border-radius:3px;background-color:${esc(v)};margin-right:6px;"></span>${esc(v)}` : '' });
}

function icon(df, ctx) {
  const v = ctx.value ?? '';
  const input = `<div class="icon-input-wrapper" style="position:relative;"><input type="text" autocomplete="off" class="input-with-feedback form-control" ${attrs(df, ctx)} placeholder="Choose an icon"${ro(df)} value="${esc(v)}" style="padding-left:34px;"><span class="icon-preview" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);">${v ? ic(esc(v)) : ''}</span></div>`;
  return wrapFrappe(df, { inputHtml: input, valueHtml: esc(v) });
}

export default {
  Attach: attachBase,
  'Attach Image': attachImage,
  Signature: signature,
  Barcode: barcode,
  Geolocation: geolocation,
  Color: color,
  Icon: icon,
};
