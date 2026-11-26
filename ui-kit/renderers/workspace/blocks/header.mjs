import { safeInline } from './common.mjs';
export default function header(data) {
  return `<div class="widget widget-group-head" data-ui="block.header"><div class="widget-group-title h4">${safeInline(data.text)}</div></div>`;
}
