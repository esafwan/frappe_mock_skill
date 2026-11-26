import { esc } from '../lib/control.mjs';
import { wrapFrappe, effectiveValue } from './base.mjs';

// Markup follows frappe v16 form/controls: text.js (ControlText: horizontal=false, .for-description
// display area), code.js (ace-editor-target + Expand button), markdown_editor.js / html_editor.js
// (<kind>-container, <kind>-toggle, <kind>-preview), text_editor.js (Quill snow toolbar + ql-editor).
const attrs = (df, ctx) => `data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" data-doctype="${esc(ctx.doctype || '')}"`;
const ro = (df) => (df.read_only ? ' disabled' : '');
const raw = (v) => (v === undefined || v === null ? '' : typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v));
const icon = (n) => `<svg class="icon icon-sm" style="" aria-hidden="true"><use class="" href="#icon-${n}"></use></svg>`;
const maxH = (df) => (df.max_height ? `max-height: ${esc(df.max_height)}; ` : '');
const stripScripts = (h) => String(h ?? '').replace(/<(script|style)\b[\s\S]*?<\/\1\s*>/gi, '');

// ControlText: <textarea class="input-with-feedback form-control"> (height set by make_input)
function textarea(h) {
  return (df, ctx) => {
    const v = raw(effectiveValue(df, ctx));
    return wrapFrappe(df, {
      horizontal: false,
      valueClass: 'for-description',
      valueAttrs: ` style="white-space-collapse: preserve;${df.max_height ? ` max-height: ${esc(df.max_height)}; overflow: auto;` : ''}"`,
      inputHtml: `<textarea type="text" autocomplete="off" class="input-with-feedback form-control${df.bold ? ' bold' : ''}" style="height: ${h}px;${df.max_height ? ` max-height: ${esc(df.max_height)};` : ''}" ${attrs(df, ctx)} placeholder=""${ro(df)}>${esc(v)}</textarea>`,
      valueHtml: esc(v),
    });
  };
}

// ControlCode.make_ace_editor: .ace-editor-target.border.rounded (300px) + "Expand" button in input wrapper
function aceTarget(df, ctx, mode, v) {
  const lines = v === '' ? [''] : v.split('\n');
  const gutter = lines.map((_, i) => `<div class="ace_gutter-cell" style="height: 16px;">${i + 1}</div>`).join('');
  const body = lines.map((l) => `<div class="ace_line" style="height: 16px;">${esc(l) || '&nbsp;'}</div>`).join('');
  return `<div class="ace-editor-target border rounded ace_editor ace-tm" style="height: 300px; ${maxH(df)}font: 12px/16px 'SFMono-Regular', Menlo, Consolas, monospace;" data-mode="${mode}" ${attrs(df, ctx)}><div class="ace_gutter" style="display: block; width: 40px;"><div class="ace_layer ace_gutter-layer">${gutter}</div></div><div class="ace_scroller" style="left: 40px;"><div class="ace_content"><div class="ace_layer ace_text-layer">${body}</div></div></div></div>`;
}
const expandBtn = (df) => (df.max_lines || df.min_lines || df.max_height ? '' : `<button class="btn btn-xs btn-default mt-2">Expand</button>`);
const copyBtn = (df) => (df.read_only ? `<button class="btn icon-btn" style="position: absolute; top: 32px; right: 5px;" title="Copy to Clipboard">${icon('copy')}</button>` : '');

function ace(mode, pretty, kind) {
  return (df, ctx) => {
    let v = raw(effectiveValue(df, ctx));
    if (pretty && v) { try { v = JSON.stringify(typeof ctx.value === 'string' ? JSON.parse(v) : (ctx.value ?? JSON.parse(v)), null, 2); } catch { /* keep raw */ } }
    let target = aceTarget(df, ctx, mode, v);
    if (kind) {
      // markdown_editor.make_ace_editor: wrap target in <kind>-container, prepend toggle, append preview
      target = `<div class="${kind}-container"><button class="btn btn-default btn-xs ${kind}-toggle">Preview</button>${target}<div class="${kind}-preview border rounded" style="display: none;"></div></div>`;
    }
    const out = wrapFrappe(df, {
      horizontal: false,
      valueClass: 'for-description',
      valueAttrs: ' style="white-space-collapse: preserve;"',
      inputHtml: target,
      valueHtml: kind ? esc(v) : `<pre>${esc(v)}</pre>`,
    });
    // $expand_button is appended to $input_wrapper (after the help-box); copy button to $wrapper (Code only)
    const tail = expandBtn(df);
    const withExpand = out.replace(/(<div class="help-box[^>]*>[\s\S]*?<\/div>)(\s*<\/div>\s*<\/div>\s*<\/div>\s*)$/, `$1${tail}$2`);
    return df.fieldtype === 'Code' ? withExpand.replace(/(\s*<\/div>\s*)$/, `${copyBtn(df)}$1`) : withExpand;
  };
}

// ---- Text Editor (Quill 2, snow theme) -------------------------------------------------------
const tbtn = (cls, ic, extra = '') => `<button type="button" class="ql-${cls}"${extra}>${icon(ic)}</button>`;
const picker = (name, label, items, iconCls = '') => `<span class="ql-${name} ql-picker${iconCls}"><span class="ql-picker-label" tabindex="0" role="button" aria-expanded="false">${label}</span><span class="ql-picker-options" aria-hidden="true">${items}</span></span>`;
const pitem = (v, txt = '') => `<span tabindex="0" role="button" class="ql-picker-item"${v === '' ? '' : ` data-value="${v}"`}>${txt}</span>`;
const caret = '<svg class="ql-picker-caret" aria-hidden="true" stroke="currentColor" fill="none"><use href="#icon-chevron-down"></use></svg>';
const FONT_SIZES = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '24px', '36px'];
const TEXT_EDITOR_TOOLBAR = [
  `<span class="ql-formats">${picker('header', caret, [1, 2, 3, 4, 5, 6].map((n) => pitem(String(n), icon(`heading-${n}`))).join('') + pitem('', icon('pilcrow')))}</span>`,
  `<span class="ql-formats">${picker('size', icon('a-large-small'), FONT_SIZES.map((s) => pitem(s, s)).join(''))}</span>`,
  `<span class="ql-formats">${tbtn('bold', 'bold')}${tbtn('italic', 'italic')}${tbtn('underline', 'underline')}${tbtn('strike', 'strikethrough')}${tbtn('clean', 'eraser')}</span>`,
  `<span class="ql-formats">${picker('color', icon('paint-bucket'), '', ' ql-color-picker ql-icon-picker')}${picker('background', icon('highlighter'), '', ' ql-color-picker ql-icon-picker')}</span>`,
  `<span class="ql-formats">${tbtn('blockquote', 'quote')}${tbtn('code-block', 'code')}</span>`,
  `<span class="ql-formats">${tbtn('direction', 'pilcrow-left', ' value="rtl"')}</span>`,
  `<span class="ql-formats">${tbtn('link', 'link-2')}${tbtn('image', 'image-plus')}</span>`,
  `<span class="ql-formats">${tbtn('list', 'list-ordered', ' value="ordered"')}${tbtn('list', 'list', ' value="bullet"')}${tbtn('list', 'list-check', ' value="check"')}</span>`,
  `<span class="ql-formats">${picker('align', icon('text-align-start'), pitem('', icon('text-align-start')) + ['center', 'right', 'justify'].map((a) => pitem(a, icon(`text-align-${a === 'right' ? 'end' : a}`))).join(''), ' ql-icon-picker')}</span>`,
  `<span class="ql-formats">${tbtn('indent', 'list-indent-decrease', ' value="-1"')}${tbtn('indent', 'list-indent-increase', ' value="+1"')}</span>`,
  `<span class="ql-formats">${picker('table', icon('table-properties'), ['insert-table', 'insert-row-above', 'insert-row-below', 'insert-column-right', 'insert-column-left', 'delete-row', 'delete-column', 'delete-table'].map((a) => pitem(a)).join(''), ' ql-icon-picker')}</span>`,
].join('');

function textEditor(df, ctx) {
  const v = stripScripts(raw(effectiveValue(df, ctx)));
  const blank = !v || v === '<p><br></p>';
  const editor = `<div class="ql-editor${blank ? ' ql-blank' : ''}" data-placeholder="Type something..." contenteditable="${df.read_only ? 'false' : 'true'}" spellcheck="true">${blank ? '<p><br></p>' : v}</div>`;
  const quill = `<div${df.max_height ? ` style="max-height: ${esc(df.max_height)}; overflow: auto;"` : ''}><div class="ql-toolbar ql-snow">${TEXT_EDITOR_TOOLBAR}</div><div class="ql-container ql-snow">${editor}<div class="ql-clipboard" contenteditable="true" tabindex="-1"></div><div class="ql-tooltip ql-hidden"><a class="ql-preview" rel="noopener noreferrer" target="_blank" href="about:blank"></a><input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" data-video="Embed URL"><a class="ql-action"></a><a class="ql-remove"></a></div></div></div>`;
  return wrapFrappe(df, {
    horizontal: false,
    valueClass: 'for-description',
    valueAttrs: ' style="white-space-collapse: preserve;"',
    inputHtml: quill,
    valueHtml: `<div class="ql-editor read-mode">${v}</div>`,
  });
}

// Comment (timeline composer), not a Frappe form control; kept from before.
const comment = (df, ctx) => {
  const v = raw(effectiveValue(df, ctx));
  return wrapFrappe(df, {
    inputHtml: `<div class="comment-input-wrapper"><div class="comment-input-container"><div class="ql-editor read-mode" data-placeholder="Type a reply / comment" contenteditable="true" ${attrs(df, ctx)}>${v ? `<p>${esc(v)}</p>` : ''}</div></div><button type="button" class="btn btn-default btn-comment btn-xs">Comment</button></div>`,
    valueHtml: esc(v),
  });
};

export default {
  'Small Text': textarea(150),
  Text: textarea(300),
  'Long Text': textarea(300),
  Code: ace('code', false),
  JSON: ace('json', true),
  'HTML Editor': ace('html', false, 'html'),
  'Markdown Editor': ace('markdown', false, 'markdown'),
  'Text Editor': textEditor,
  Comment: comment,
};
