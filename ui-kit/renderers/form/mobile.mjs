// Form at phone (<768) and tablet (768..1023) widths. Generic: no doctype/app/brand names.
//   applyFormMobile(html, ctx) -> html     pure post-processor over a rendered form document
//   formMobileCss()            -> css      the rules alone, for callers that inject their own <style>
// Phone: sections stack to one column, the page-head action area becomes a sticky bottom bar,
// bar dropdowns open upward, content gets bottom padding so the bar never hides the last field.
// Tablet: the action bar is sticky too; columns wrap at two per row. Desktop: unchanged (returns html as is).
const MARK = 'data-ui="form.mobile"';

/** 'phone' | 'tablet' | 'desktop' from ctx.viewport (object, "WxH" string or preset name). */
export function formBreakpoint(ctx = {}) {
  const v = ctx.viewport;
  let w;
  if (v && typeof v === 'object') w = Number(v.width) || (/^mobile$/i.test(v.device || '') ? 375 : /^tablet$/i.test(v.device || '') ? 768 : 1440);
  else if (/^mobile$/i.test(v || '')) w = 375;
  else if (/^tablet$/i.test(v || '')) w = 768;
  else w = parseInt(String(v || '').split('x')[0], 10) || 1440;
  return w < 768 ? 'phone' : w < 1024 ? 'tablet' : 'desktop';
}

const BAR = '.page-head .standard-items-section';
export function formMobileCss() {
  return `@media (max-width:1023.98px){
body .page-head{position:static}
body ${BAR}{position:fixed;left:0;right:0;bottom:0;z-index:1030;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding:8px 12px;background:var(--surface-white,#fff);border-top:1px solid var(--outline-gray-1);box-sizing:border-box}
body ${BAR} .page-actions{display:flex;flex:1 1 auto;min-width:0;justify-content:flex-end;gap:8px;flex-wrap:nowrap}
body ${BAR} .standard-actions{display:flex;gap:8px;align-items:center}
body ${BAR} .dropdown-menu{top:auto;bottom:calc(100% + 4px);max-width:calc(100vw - 24px)}
body .layout-main-section-wrapper,body .layout-main-section{min-width:0;max-width:100%}
body[data-route^=Form] .layout-main-section-wrapper,body .layout-main-section-wrapper{width:100%;flex:1 1 auto}
body .form-page,body .form-layout{padding-bottom:72px}
body .section-body{flex-wrap:wrap}
body .form-column{min-width:0;flex:1 1 50%;max-width:100%}
body .form-column .frappe-control,body .form-column input,body .form-column select,body .form-column textarea{max-width:100%}
}
@media (max-width:767.98px){
body .layout-main{flex-direction:column}
body .form-section,body .form-tab-content,body .tab-pane{max-width:100%}
body .section-body .form-column,body[data-route^=Form] .section-body .form-column{display:block;width:100%;max-width:100%;flex:0 0 100%}
body .section-body{display:block}
body .form-column{width:100%;max-width:100%;flex:0 0 100%;padding-left:0;padding-right:0}
body .form-tabs-list{overflow-x:auto}
body .form-page{overflow-x:hidden}
body .page-head-content{flex-wrap:nowrap}
body .page-title{min-width:0}
}`;
}

export function applyFormMobile(html, ctx = {}) {
  if (typeof html !== 'string' || html.includes(MARK)) return html;
  if (formBreakpoint(ctx) === 'desktop') return html;
  if (!html.includes('data-ui="form.page"')) return html; // forms only
  const style = `<style ${MARK}>${formMobileCss()}</style>`;
  return html.includes('</head>') ? html.replace('</head>', `${style}</head>`) : style + html;
}

export default applyFormMobile;
