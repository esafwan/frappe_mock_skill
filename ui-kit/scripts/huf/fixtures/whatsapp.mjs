// WhatsApp area fixtures: the Channels app (/channels/whatsapp/n/<gw>/...), templates list + detail, drafts, wizard.
// Shapes follow HUF's own offline mocks (frontend/e2e/whatsapp.spec.ts, e2e/helpers/formGeometryMocks.ts).
// Data: data/huf/whatsapp.json (fictional: Northwind Trading). Empty states: specs override list_templates in prepare (see emptyTemplates in specs-huf-whatsapp.mjs).
import fs from 'fs';

const MGMT = '**/api/method/huf.ai.whatsapp.management.';

/** Fictional header image for the "spring_restock" template (served from the fake origin, inlined by capture). */
export const SPRING_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E7C8"/><stop offset="1" stop-color="#E7B96A"/></linearGradient></defs>
<rect width="640" height="360" fill="url(#g)"/>
<circle cx="520" cy="80" r="120" fill="#FFF6E3" opacity=".55"/>
<g transform="translate(380 150)"><rect x="0" y="40" width="64" height="150" rx="14" fill="#5B7F3A"/><rect x="18" y="10" width="28" height="40" rx="6" fill="#3E5A26"/><rect x="8" y="90" width="48" height="50" rx="6" fill="#F3E3B5"/></g>
<g transform="translate(470 180)"><rect x="0" y="30" width="56" height="130" rx="12" fill="#A7652C"/><rect x="15" y="4" width="26" height="34" rx="6" fill="#7A4518"/><rect x="7" y="70" width="42" height="42" rx="6" fill="#F3E3B5"/></g>
<g transform="translate(548 220)"><rect x="0" y="0" width="70" height="100" rx="10" fill="#C0392B"/><rect x="8" y="30" width="54" height="38" rx="5" fill="#F3E3B5"/></g>
<text x="40" y="140" font-family="Arial,sans-serif" font-size="44" font-weight="700" fill="#3B2A12">Spring range</text>
<text x="40" y="190" font-family="Arial,sans-serif" font-size="44" font-weight="700" fill="#3B2A12">is in stock</text>
<text x="40" y="240" font-family="Arial,sans-serif" font-size="22" fill="#5C4422">Olive oils · pasta · spices</text>
<rect x="40" y="272" width="190" height="44" rx="22" fill="#3B2A12"/><text x="135" y="301" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" font-weight="700" fill="#FFF6E3">Trade prices</text>
</svg>`;

/** Simple fictional product tiles for carousel cards. */
const tile = (bg, fg, title, sub) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360"><rect width="640" height="360" fill="${bg}"/><circle cx="500" cy="180" r="120" fill="${fg}" opacity=".35"/><circle cx="500" cy="180" r="70" fill="${fg}" opacity=".6"/><text x="40" y="170" font-family="Arial,sans-serif" font-size="46" font-weight="700" fill="#2B2116">${title}</text><text x="40" y="220" font-family="Arial,sans-serif" font-size="24" fill="#4A3B2A">${sub}</text></svg>`;
export const IMAGES = {
  'northwind-spring-restock.svg': SPRING_SVG,
  'northwind-card-pasta.svg': tile('#F4E2B8', '#D9A441', 'Bronze-cut pasta', 'Casa Rinaldi · from €2.10'),
  'northwind-card-spices.svg': tile('#F2CDB4', '#B5532B', 'Smoked paprika', 'Vera Spice Co. · from €4.80'),
};

export function load(ROOT) { return JSON.parse(fs.readFileSync(ROOT + 'data/huf/whatsapp.json', 'utf8')); }

const gatewayStatus = (g) => ({
  name: g.name, enabled: g.enabled, whatsapp_account: 'Northwind WABA', phone_number_id: '100000000000142', account_phone_mismatch: false,
  webhook_url: `https://hub.example.com/api/method/huf.ai.whatsapp.webhook?gateway_name=${encodeURIComponent(g.name)}`,
  health: g.health, setup_stage: g.setup_stage, reasons: [], next_step: null,
  checklist: [{ code: 'credentials', state: 'done' }, { code: 'webhook', state: 'done' }, { code: 'test_message', state: 'done' }],
  fallback_template: 'order_shipped', fallback_template_language: 'en_US', fallback_template_approved: true,
  last_event_at: '2026-01-01T08:57:00Z', last_error: null, access_token_present: true, app_id_present: true, app_secret_present: true, verify_token_present: true,
  events_24h: { received: 214, failed: 1, unrouted: 0, rejected: 0 }, last_failed_event: null, unrouted_phone_ids: [],
  policy: { direct_policy: 'Open', room_policy: 'Disabled', pairing_ttl_minutes: 60 },
  meta_links: { app_dashboard: null, whatsapp_manager: null, webhook_config: null },
});

/** List row (WhatsAppTemplate) from the detail-shaped fixture entry. */
export const toRow = (t) => {
  const c = t.components;
  return {
    name: t.name, template_name: t.template_name, actual_name: t.template_name, category: t.category, language_code: t.language_code, status: t.status, id: t.name.replace(/\D/g, ''),
    whatsapp_account: 'Northwind WABA', header_type: c.header ? c.header.type : '', header: c.header ? c.header.text : '', footer: c.footer ? c.footer.text : '',
    template: c.body.text, sample_values: (c.body.sample_values || []).join(','),
    buttons: (c.buttons || []).map((b) => ({ button_type: b.type, button_label: b.text, website_url: b.url, phone_number: b.phone_number })),
    rejected_reason: t.rejected_reason || '', quality_score: t.quality_score || '', last_meta_update: t.last_meta_update, used_by: [], shared: false,
  };
};
const toDetail = (t) => ({
  name: t.name, template_id: t.name.replace(/\D/g, ''), template_name: t.template_name, language_code: t.language_code, category: t.category,
  correct_category: t.category, category_change_pending: false, status: t.status, whatsapp_account: 'Northwind WABA', components: t.components,
  state: { rejected_reason: t.rejected_reason || '', rejection_recommendation: t.rejection_recommendation || '', other_info: '', quality_score: t.quality_score || '',
    last_event: t.status, last_event_at: t.last_meta_update, last_meta_update: t.last_meta_update },
  parameter_format: 'POSITIONAL', ttl_seconds: t.ttl_seconds ?? null, editable: true, edits_left: t.edits_left ?? 10, manager_url: '', business_id: '',
});

export async function install(page, { json, args, ROOT }) {
  const data = load(ROOT);
  const { templates, drafts } = data;
  const ok = (r, m) => json(r, { message: m });
  const on = (method, fn, base = MGMT) => page.route(`${base}${method}{,?*}`, (r) => ok(r, fn(args(r.request()))));
  await page.route('**/files/northwind-*.svg', (r) => { const f = new URL(r.request().url()).pathname.split('/').pop(); return IMAGES[f] ? r.fulfill({ status: 200, contentType: 'image/svg+xml', body: IMAGES[f] }) : r.fulfill({ status: 404, body: '' }); });
  await on('list_channel_gateways', () => data.gateways.map((g) => ({ name: g.name, provider: 'WhatsApp', channel: 'whatsapp', enabled: g.enabled, health: g.health, setup_stage: g.setup_stage })), '**/api/method/huf.ai.channels.status_api.');
  await on('get_setup_status', (a) => a.gateway_name
    ? { success: true, connector_available: true, accounts: [], gateway: gatewayStatus(data.gateways.find((g) => g.name === a.gateway_name) || data.gateways[0]) }
    : { success: true, connector_available: true, accounts: [], gateways: data.gateways.map((g) => ({ name: g.name, health: g.health, enabled: g.enabled, setup_stage: g.setup_stage })) });
  await on('check_token', () => ({ success: true, valid: true, token_type: 'SYSTEM_USER', expires_at: null, missing_scopes: [], waba_ids: [], phone: { quality: 'GREEN', display_phone_number: data.gateways[0].display_phone_number, verified_name: data.gateways[0].verified_name }, webhook_subscribed: true, checked_at: '2026-01-01T08:00:00Z', source: 'debug_token' }));
  await on('list_templates', () => ({ success: true, templates: templates.map(toRow), manager_url: '', business_id: '' }));
  await on('get_template', (a) => ({ success: true, ...toDetail(templates.find((t) => t.name === a.name || t.template_name === a.name) || data.templates[0]) }));
  await on('list_template_drafts', () => ({ success: true, drafts }));
  // broadcast wizard (/broadcasts/new): template params for the chosen template, saved audiences and the selection preview
  const B = data.broadcast;
  const aud = (a) => ({ gateway: data.gateways[0].name, is_adhoc: false, externally_managed: false, default_consent_at: '2025-11-02 10:00:00', consent_attested_by: 'maya@example.com', consent_attested_at: '2025-11-02 10:00:00', creation: '2025-11-02 10:00:00', modified: '2025-12-30 10:00:00', ...a });
  const BC = '**/api/method/huf.ai.whatsapp.broadcast.';
  await on('api_read.get_broadcast_template_params', () => B.params, BC);
  await on('api_limits.get_broadcast_limits', () => ({ limits: [] }), BC);
  await on('audiences.api.list_audiences', () => ({ success: true, audiences: B.audiences.map(({ tags, ...a }) => aud(a)), total: B.audiences.length }), BC);
  await on('audiences.api.get_audience', (a) => { const x = B.audiences.find((y) => y.name === a.audience) || B.audiences[0]; return { success: true, audience: { ...aud(x), used_by: [], can_see_numbers: true } }; }, BC);
  await on('audiences.api.preview_audience_selection_for_gateway', () => ({ success: true, counts: B.preview, per_audience: [{ audience: B.audiences[0].name, matched: B.preview.total, added: B.preview.final }], blocked: [], category: 'MARKETING', purpose_required: 'marketing', estimated: false }), BC);
}
