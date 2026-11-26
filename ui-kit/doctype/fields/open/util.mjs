// Shared helpers for field_open states. Generic; no doctype names.
export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ICON = (n, c = 'icon-sm') => `<svg class="icon ${c}" aria-hidden="true"><use href="#icon-${n}"></use></svg>`;
export { ICON };

// Insert popup HTML right after the first <input ...> inside the field html (inside .awesomplete/.control-input).
export function injectAfterInput(html, popup) {
  const i = html.search(/<input\b[^>]*>/);
  if (i < 0) return html;
  const end = html.indexOf('>', i) + 1;
  return html.slice(0, end) + popup + html.slice(end);
}
// Replace the empty hidden awesomplete list (if any) with `popup`, else inject after input.
export function injectList(html, popup) {
  const re = /<ul hidden=""[^>]*>[^]*?<\/ul>/;
  return re.test(html) ? html.replace(re, popup) : injectAfterInput(html, popup);
}
export function setInputValue(html, v) {
  if (v === undefined || v === null) return html;
  return html.replace(/(<input\b[^>]*?)(\svalue="[^"]*")?(\s*\/?>)/, (m, a, _b, c) => `${a} value="${esc(v)}"${c}`);
}
export const setAttr = (html, attr) => html.replace(/(<input\b)/, `$1 ${attr}`);
export const addWrapperClass = (html, cls) =>
  html.replace(/class="((?:form-group|frappe-control)[^"]*)"/, (m, c) => `class="${c} ${cls}"`);
