import { esc, icon } from './common.mjs';
import { button } from '../../../kit-lib/buttons.mjs';
import { badge } from '../../../kit-lib/badges.mjs';
// v16 onboarding widget: segmented progress, accordion of steps, one open step with description + actions.
// Data: data.onboarding[name] = {title, open?, steps:[{title, description, status: Complete|Pending|Skipped,
//   is_complete, is_skipped, is_optional, module, action_label, can_import, intro_video_url}]}
const stepState = (s) => (s.is_complete || s.status === 'Complete' ? 'complete' : s.is_skipped || s.status === 'Skipped' ? 'skipped' : 'pending');
export default function onboarding(data, ctx, spec) {
  const name = data.onboarding_name;
  const d = spec.data?.onboarding?.[name];
  if (!d) ctx.warn(`workspace: no data.onboarding["${name}"]; rendering header only`);
  const steps = (d?.steps || []).map((s) => ({ ...s, _st: stepState(s) }));
  const required = steps.filter((s) => !s.is_optional);
  const req = required.length ? required : steps;
  const completed = req.filter((s) => s._st === 'complete').length;
  const skipped = req.filter((s) => s._st === 'skipped').length;
  const total = req.length;
  const progressText = skipped ? `<bdi>${completed}</bdi> of <bdi>${total}</bdi> done · <bdi>${skipped}</bdi> skipped` : `<bdi>${completed}</bdi> of <bdi>${total}</bdi> steps done`;
  const segs = req.map((s) => `<span class="progress-interval ${s._st === 'pending' ? '' : 'filled'}" style="flex:1;height:100%;border-radius:2px;background:${s._st === 'pending' ? 'var(--bg-gray, #ededed)' : 'var(--ink-green-7, #28a745)'}"></span>`).join('');
  const nextIdx = steps.findIndex((s) => s._st === 'pending');
  const openIdx = Number.isInteger(d?.open) ? d.open : nextIdx;
  const list = steps.map((s, i) => {
    const open = i === openIdx;
    const st = s._st;
    const ic = st === 'complete' ? icon('circle-check', 'sm') : st === 'skipped' ? icon('circle-dashed', 'sm') : icon('circle', 'sm');
    const cls = ['onboarding-step', 'rounded-md', 'px-2', open ? 'is-open' : '', st === 'complete' ? 'complete' : '', st === 'skipped' ? 'skipped' : '', s.module ? 'has-module' : ''].filter(Boolean).join(' ');
    const title = s.module
      ? `<span class="step-module shrink-0">${esc(s.module)}</span><span class="step-title text-base truncate">${esc(s.title)}</span>`
      : `<span class="step-title text-base truncate">${esc(s.title)}</span>`;
    const head = `<button type="button" class="onboarding-step-head flex items-center gap-2 w-full" aria-expanded="${open}"><span class="step-icon shrink-0 flex">${ic}</span>${title}${s.is_optional ? badge('Optional', 'gray') : ''}${st === 'skipped' ? '<span class="step-skipped text-p-sm text-ink-gray-4 ms-auto">Skipped</span>' : ''}</button>`;
    let body = '';
    if (open) {
      const actions = [button(s.action_label || s.title, { variant: 'solid', icon: undefined, ui: 'onboarding.action' })];
      if (s.can_import) actions.push(button('Import', { variant: 'subtle', icon: 'import' }));
      if (st === 'pending') actions.push(button('Skip', { variant: 'subtle' }));
      const media = s.intro_video_url ? `<div class="onboarding-step-media"><button type="button" class="onboarding-video" aria-label="Play video"><span class="onboarding-video-play">${icon('play', 'md')}</span></button></div>` : '';
      body = `<div class="onboarding-step-collapse"><div class="onboarding-step-body"><div class="onboarding-step-content flex flex-col gap-3">${s.description ? `<div class="onboarding-step-description text-p-sm text-ink-gray-6">${esc(s.description)}</div>` : ''}<div class="flex items-center gap-2" data-ui="onboarding.actions">${actions.join('')}</div></div></div>${media}</div>`;
    }
    return `<div class="${cls}" data-ui="onboarding.step" data-status="${esc(s.status || (st === 'complete' ? 'Complete' : st === 'skipped' ? 'Skipped' : 'Pending'))}">${head}${body}</div>`;
  }).join('');
  const done = total > 0 && completed + skipped === total;
  const success = done ? `<div class="onboarding-success text-p-sm text-ink-gray-6" data-ui="onboarding.success">${icon('circle-check', 'sm')} All steps are done</div>` : '';
  return `<div class="widget onboarding-widget-box" data-ui="card:${esc(name)}" data-widget-name="${esc(name)}"><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis">${esc(d?.title || name)}</span></div><div class="widget-subtitle" data-ui="onboarding.progress" dir="auto">${progressText}</div></div></div><div class="widget-body"><div class="progress onboarding-progress" data-ui="onboarding.bar" role="progressbar" aria-valuenow="${total ? Math.round(((completed + skipped) / total) * 100) : 0}" style="display:flex;gap:2px;height:6px;margin-bottom:8px">${segs}</div><div class="onboarding-steps flex flex-col gap-0.5">${list}</div>${success}</div></div>`;
}
