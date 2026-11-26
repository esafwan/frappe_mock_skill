import { esc, addWrapperClass } from './util.mjs';

/** Mandatory error highlight: has-error on the group, red border, "Value missing" help. ov: { message } */
export function mandatoryError(html, df, ctx, ov = {}) {
  const msg = ov.message || 'Value missing';
  let out = addWrapperClass(html, 'has-error');
  out = out.replace(/<div class="form-group([^"]*)"/, '<div class="form-group$1 has-error"');
  out = out.replace(/(<input\b|<select\b|<textarea\b)/, '$1 aria-invalid="true" style="border-color:var(--red-500,#e24c4c)"').replace(/ style="border-color:[^"]*"([^>]*?) style="/, ' style="border-color:var(--red-500,#e24c4c);');
  out = out.replace(/(<label class="control-label)(?![^"]*reqd)([^"]*")/, '$1 reqd$2');
  return out.replace(/(<div class="help-box small text-extra-muted)(?: hide)?(">)[^]*?(<\/div>)/, `$1 text-danger$2${esc(msg)}$3`);
}

/** permlevel / read-only: hide the input, show the like-disabled value. ov: { value } */
export function permlevelReadOnly(html, df, ctx, ov = {}) {
  const v = ov.value ?? ctx.value;
  let out = html.replace(/<div class="control-input"([^>]*)>/, '<div class="control-input"$1 style="display:none">');
  out = out.replace(/(<div class="control-value like-disabled-input[^"]*?)(?: hide)?("[^>]*>)([^]*?)(<\/div>)/, (m, a, b, inner, c) => `${a}${b}${inner || esc(v)}${c}`);
  return addWrapperClass(out, 'read-only');
}
