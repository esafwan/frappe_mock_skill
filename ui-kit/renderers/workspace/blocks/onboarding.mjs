import { esc, icon } from './common.mjs';
// Steps come from data.onboarding[name] = {title, steps:[{title, description, status: Complete|Pending|Skipped, action_label}]}
export default function onboarding(data, ctx, spec) {
  const name = data.onboarding_name;
  const d = spec.data?.onboarding?.[name];
  if (!d) { ctx.warn(`workspace: no data.onboarding["${name}"]; rendering header only`); }
  const steps = d?.steps || [];
  const done = steps.filter((s) => s.status === 'Complete' || s.status === 'Skipped').length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;
  const list = steps.map((s, i) => {
    const complete = s.status === 'Complete', skipped = s.status === 'Skipped';
    const open = i === (d.open ?? steps.findIndex((x) => x.status !== 'Complete'));
    return `<div class="onboarding-step ${complete ? 'complete' : ''} ${skipped ? 'skipped' : ''} ${open ? 'active' : ''}" data-ui="onboarding.step" data-status="${esc(s.status || 'Pending')}"><div class="step-title"><span class="step-check">${complete ? icon('check', 'xs') : skipped ? icon('minus', 'xs') : `<span class="step-no">${i + 1}</span>`}</span><span class="ellipsis">${esc(s.title)}</span></div>${open ? `<div class="step-body"><p class="text-muted">${esc(s.description || '')}</p>${s.action_label ? `<button class="btn btn-primary btn-xs">${esc(s.action_label)}</button>` : ''}</div>` : ''}</div>`;
  }).join('');
  return `<div class="widget onboarding-widget-box" data-ui="card:${esc(name)}" data-widget-name="${esc(name)}"><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis">${esc(d?.title || name)}</span></div><div class="widget-subtitle" data-ui="onboarding.progress">${done} of ${steps.length} steps completed</div></div></div><div class="progress onboarding-progress"><div class="progress-bar" style="width:${pct}%" role="progressbar" aria-valuenow="${pct}"></div></div><div class="widget-body onboarding-steps">${list}</div></div>`;
}
