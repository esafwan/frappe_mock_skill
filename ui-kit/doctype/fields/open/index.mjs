// field_open overlay: {type:'field_open', field, state?, ...state data}. Generic; keyed by fieldtype.
// Usage (form renderer): html = applyFieldOpen(html, df, ctx, overlay)
import { linkOpen } from './link.mjs';
import { dateOpen, timeOpen } from './picker.mjs';
import { colorOpen } from './color.mjs';
import { multiselectOpen } from './multiselect.mjs';
import { mandatoryError, permlevelReadOnly } from './states.mjs';

export const FIELD_OPEN_STATES = ['open', 'error', 'readonly'];
const OPEN = {
  Link: linkOpen, 'Dynamic Link': linkOpen, Autocomplete: linkOpen,
  Date: dateOpen, Datetime: dateOpen, Time: timeOpen,
  Color: colorOpen, 'Table MultiSelect': multiselectOpen,
};

export function applyFieldOpen(html, df, ctx = {}, ov = {}) {
  const st = ov.state || 'open';
  if (st === 'error') return mandatoryError(html, df, ctx, ov);
  if (st === 'readonly') return permlevelReadOnly(html, df, ctx, ov);
  const fn = OPEN[df.fieldtype];
  return fn ? fn(html, df, ctx, ov) : html;
}
export { linkOpen, dateOpen, timeOpen, colorOpen, multiselectOpen, mandatoryError, permlevelReadOnly };
export default {};
