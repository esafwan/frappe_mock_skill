import { numberCard } from '../../../kit-lib/numbercard.mjs';
import { findIn, colourOf } from './common.mjs';
export default function numberCardBlock(data, ctx, spec) {
  const name = data.number_card_name;
  const meta = findIn(spec.meta.workspace.number_cards, ['number_card_name', 'label', 'name'], name) || {};
  const d = spec.data?.number_cards?.[name];
  if (!d) ctx.warn(`workspace: no data.number_cards["${name}"]; rendering 0`);
  const v = d?.value ?? 0;
  const previous = d?.previous ?? (d?.delta !== undefined && d.delta !== -100 ? v / (1 + d.delta / 100) : undefined);
  const colour = d?.color || meta.color;
  const html = numberCard({ label: meta.label || name, value: v, previous, currency: d?.currency || meta.currency, colour: colour ? String(colour).toLowerCase() : undefined, compact: d?.compact, locale: ctx.locale, system: ctx.formatSystem, subtitle: d?.subtitle, deltaLabel: d?.deltaLabel });
  const label = meta.label || name;
  return html.replace(/^<([a-zA-Z][\w-]*)/, (m, t) => `<${t} data-ui="card:${String(label).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`);
}
