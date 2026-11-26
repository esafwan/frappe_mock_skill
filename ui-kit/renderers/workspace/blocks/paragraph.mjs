import { safeInline } from './common.mjs';
export default function paragraph(data) {
  return `<div class="ce-paragraph" data-ui="block.paragraph">${safeInline(data.text)}</div>`;
}
