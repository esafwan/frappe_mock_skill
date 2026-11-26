// Column fitting for the list renderer: cap at the v16 list-field limit, subject first, no horizontal overflow.
import { colRange, fitWidths } from '../../kit-lib/colwidth.mjs';

/** v16 caps in-list fields shown at once (subject + status/tag are extra). */
export const V16_MAX_LIST_FIELDS = 10;
const ROW_CHROME = 230; // meta block (assign, modified, comments, like) at the row's right

/**
 * fitColumns(cols, {available, max}) -> { cols, dropped }
 * cols: output of listColumns (subject first). Reorders so subject is first, trailing ID last;
 * drops trailing field columns past `max` and any that would overflow `available` px.
 * Kept columns get `width` unless the column already has one (explicit width wins).
 */
export function fitColumns(cols, { available = 1440 - 48 - ROW_CHROME, max = V16_MAX_LIST_FIELDS, gap = 0 } = {}) {
  const subject = cols.find((c) => c.kind === 'subject') || cols[0];
  const rest = cols.filter((c) => c !== subject);
  const special = (c) => c.kind === 'status' || c.kind === 'tag' || c.kind === 'id';
  let fields = rest.filter((c) => !special(c));
  const dropped = fields.slice(max);
  fields = fields.slice(0, max);
  const keep = (set) => [subject, ...rest.filter((c) => special(c) ? true : set.includes(c))];
  let out = keep(fields);
  while (fields.length && out.reduce((s, c) => s + colRange(c)[0] + gap, 0) > available) {
    dropped.unshift(fields.pop());
    out = keep(fields);
  }
  const widths = fitWidths(out, available - gap * out.length);
  return { cols: out.map((c, i) => (c === subject || c.width ? c : { ...c, width: widths[i] })), dropped };
}
