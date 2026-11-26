// Column width model for list views. Generic: driven by fieldtype only. Deterministic, no deps.
const TABLE = {
  Check: [60, 70], Int: [70, 90], Float: [80, 100], Percent: [80, 100], Currency: [100, 130],
  Date: [100, 110], Datetime: [140, 160], Time: [80, 90], Duration: [90, 100], Select: [100, 130],
  Rating: [100, 110], Link: [120, 160], 'Dynamic Link': [120, 160], Data: [120, 160],
  Phone: [110, 130], 'Small Text': [140, 180], Text: [140, 180], Color: [80, 90],
};
export const SUBJECT_MIN = 180;
export const STATUS_W = [100, 120];
export const TAG_W = [100, 120];
export const DEFAULT_W = [110, 140];

/** [min, ideal] pixel widths for a column descriptor from listColumns(). */
export function colRange(col = {}) {
  if (col.kind === 'status') return STATUS_W;
  if (col.kind === 'tag') return TAG_W;
  if (col.kind === 'subject') return [SUBJECT_MIN, 260];
  if (col.kind === 'id') return [110, 140];
  return TABLE[col.df?.fieldtype] || DEFAULT_W;
}

/**
 * Distribute `available` px over cols. Subject takes the remainder (flex), others get ideal, shrunk toward min.
 * Returns widths array (same order). Never returns widths whose sum exceeds `available` unless mins alone do.
 */
export function fitWidths(cols, available) {
  const r = cols.map(colRange);
  const w = r.map(([, ideal]) => ideal);
  let over = w.reduce((a, b) => a + b, 0) - available;
  for (let i = w.length - 1; i >= 0 && over > 0; i--) {
    const give = Math.min(w[i] - r[i][0], over);
    w[i] -= give; over -= give;
  }
  return w;
}
