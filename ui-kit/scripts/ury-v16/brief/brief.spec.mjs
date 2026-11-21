// ury-brief specs: URY Brief PWA (brief_app, ury-erp/version-16 @100c43fe2e), 390x844 @3x, crimson primary.
import { STATE_NA } from '../lib.mjs';
import * as b from './brief.mjs';
const { en, ar, KEYS_ALL, mi } = b;

const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-brief-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/brief.css'];
const BASE = { group: 'ury-brief', static: true, width: 390, dsf: 3, canvas: 'hsl(var(--background))', css: CSS, darkTheme: 'dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.touch };
const ARNOTE = 'Arabic: fixed UI labels translated (brief_app ships no Arabic locale); sample text values are illustrative.';

// Collect the slot keys a render actually uses (default props + every variant).
const used = (render, props, variants) => {
  const set = new Set();
  const v = new Proxy({}, { get: (_, k) => (set.add(String(k)), `{{${String(k)}}}`) });
  for (const p of [props, ...Object.values(variants || {}).map((x) => ({ ...props, ...(x.props || {}) }))]) render(v, p);
  return [...set];
};
const mk = (o) => {
  const props = o.props || {};
  const keys = used(o.render, props, o.variants);
  const slots = en(...keys), rtlValues = ar(...keys);
  const miss = keys.filter((k) => !(k in slots)); if (miss.length) throw new Error(o.id + ': undefined slots ' + miss.join(','));
  return { ...BASE, ...o, props, slots, rtlValues, describe: [o.describe[0], o.describe[1] + ' ' + ARNOTE] };
};
const pad = (id, inner) => `<div class="bf" data-ui="${id}" style="padding-block:16px;padding-inline:16px">${inner}</div>`;
const flush = (id, inner, cls = '') => `<div class="bf${cls}" data-ui="${id}">${inner}</div>`;
const today = (v, id, p = {}) => `${b.topbar(v, id + '.topbar', { avatar: true, open: p.menu })}<main class="today-body">${b.hero(v)}${b.tiles(v)}<h2 class="sec">${v.sec_story}</h2>${b.fcard(v, id + '.feed-card', { kind: 'spark' })}${b.fcard(v, id + '.feed-card-top', { kind: 'top' })}</main>${b.dock(v, id + '.dock')}`;
const underlay = (v, id) => `${b.topbar(v, id + '.topbar', { avatar: true })}<main class="today-body">${b.hero(v)}${b.tiles(v)}</main>`;

const TB = 'ury-brief-topbar', TAB = 'ury-brief-tabbar', FC = 'ury-brief-feed-card';
export const specs = [
  mk({ id: TB, name: 'Brief top bar', height: undefined, props: { menu: false, avatar: false },
    render: (v, p) => flush(TB, b.topbar(v, TB + '.bar', { avatar: p.avatar, open: p.menu }), p.menu ? ' bf-stage--menu' : ''),
    variants: {
      menu: { props: { menu: true }, describe: 'Overflow menu open: Appearance, Settings, WhatsApp, Add to home screen, Sign out (48px items at 15px, radius 8, min-width 12rem).' },
      home: { props: { avatar: true }, describe: 'One-surface home variant: 48px initials avatar opens the same menu instead of Call and kebab buttons.' },
      'home-menu': { props: { avatar: true, menu: true }, describe: 'Initials avatar with the account menu open.' },
    },
    describe: ['Brief app top bar: 56px, title 17/600, one-line subtitle 12px muted, 40px circular Call and kebab buttons.', 'Use at the top of the Brief PWA; the kebab opens the overflow menu.'] }),
  mk({ id: TAB, name: 'Brief tab bar', props: { active: 'brief' },
    render: (v, p) => flush(TAB, b.tabbar(v, TAB + '.bar', p)),
    variants: { ask: { props: { active: 'ask' }, describe: 'Ask tab active.' }, call: { props: { active: 'call' }, describe: 'Call tab active.' } },
    describe: ['Brief app tab bar: Brief, Ask, Call. 56px plus a 34px home-indicator inset, 24px icons over 11/500 labels, active item shows a 64x32 radius-16 pill filled with the source --accent token (neutral warm gray in light, slate in dark; brief_app tokens.css) and primary-coloured icon and label. Icons reuse the app Icons.tsx glyphs (sparkle, send, phone).', 'Use at the bottom of the Brief PWA when voice and ask are enabled.'] }),
  mk({ id: FC, name: 'Brief feed card', props: { kind: 'spark' },
    render: (v, p) => pad(FC, b.fcard(v, FC + '.card', p)),
    variants: {
      'number-cards': { props: { kind: 'grid' }, describe: 'Number-card grid: auto-fit, min 144px (9rem) columns.' },
      'top-sellers': { props: { kind: 'top' }, describe: 'Top sellers and slowest sellers bar lists in one card (top_bottom_items slide).' },
      'slowest-sellers': { props: { kind: 'slow' }, describe: 'Ranked bars for the slowest sellers.' },
      partial: { props: { kind: 'spark', partial: true }, describe: 'Partial-data note (.dq) under the facts.' },
      unavailable: { props: { kind: 'unavailable' }, describe: '"Not recorded yet." data-quality note; no actions.' },
    },
    describe: ['Feed card (.fcard): 24px radius card with title, sub line, chart, facts and Ask about this / Dashboard actions.', 'Use for each story in Today’s story.'] }),
  mk({ id: 'ury-brief-screen-today', name: 'Screen: Brief Today', height: 844,
    render: (v, p) => b.briefScreen('ury-brief-screen-today', today(v, 'ury-brief-screen-today', p), 'bf-today'),
    variants: { menu: { props: { menu: true }, describe: 'Account menu open over the Today screen.' } },
    describe: ['Full 390x844 Today screen: top bar, net sales hero, key-number tiles, feed cards, pinned ask dock.', 'Whole-screen mockup of the Brief home.'] }),
  mk({ id: 'ury-brief-screen-chats', name: 'Screen: Brief chats sheet', height: 844,
    render: (v) => b.briefScreen('ury-brief-screen-chats', `${underlay(v, 'ury-brief-screen-chats')}<div class="scrim sheet-scrim"><div class="sheet tall-sheet" role="dialog" aria-modal="true" data-ui="ury-brief-screen-chats.sheet"><div class="grab" aria-hidden="true"></div><div class="lh"><button type="button" class="icon-btn" aria-label="${v.c_close}">${mi('close', 24)}</button><h2>${v.c_title}</h2><span class="lh-gap"></span></div><div class="lb"><label class="search">${mi('search', 22)}<input placeholder="${v.c_search}" aria-label="${v.c_search}"></label><div class="recent">${b.crow(v, 1, { pending: true })}${b.crow(v, 2)}${b.crow(v, 3, { voice: true })}${b.crow(v, 4)}</div></div></div></div>`, 'bf-chats'),
    describe: ['All questions sheet: grab handle, Close, search field and conversation rows (pending dot, voice glyph, time, kebab).', 'Opened from See all on Today.'] }),
  mk({ id: 'ury-brief-screen-chat', name: 'Screen: Brief chat', height: 844, props: { rec: false, empty: false, typing: false },
    render: (v, p) => b.briefScreen('ury-brief-screen-chat', `<section class="chat" aria-label="Ask">${b.threadBar(v, 'ury-brief-screen-chat')}${b.messages(v, p)}${b.composer(v, 'ury-brief-screen-chat', p.rec)}</section>`, 'bf-chat'),
    variants: {
      recording: { props: { rec: true }, describe: 'Recording composer: cancel, red dot, timer and live waveform bars.' },
      empty: { props: { empty: true }, describe: 'New chat: intro and starter questions.' },
      typing: { props: { typing: true }, describe: 'Assistant typing indicator.' },
    },
    describe: ['Chat thread: WhatsApp-pattern bubbles with KPI and bar cards, a voice message, reply player and composer.', 'Thread opened from the chats sheet or an Ask action.'] }),
  mk({ id: 'ury-brief-screen-call', name: 'Screen: Brief call', height: 844, props: { state: 'listening' },
    render: (v, p) => b.briefScreen('ury-brief-screen-call', b.callView(v, 'ury-brief-screen-call.call', p), 'bf-call'),
    variants: {
      idle: { props: { state: 'idle' }, describe: 'Idle: Tap to talk with the green Call button.' },
      speaking: { props: { state: 'speaking' }, describe: 'Assistant speaking: orb glow at full level.' },
      muted: { props: { state: 'listening', muted: true }, describe: 'Muted: dimmed orb, pressed Unmute control.' },
      failed: { props: { state: 'failed' }, describe: 'Could not connect: red orb and Try again.' },
      ended: { props: { state: 'ended' }, describe: 'Call ended: neutral orb and Call again.' },
    },
    describe: ['Voice call overlay: back button, time-left pill, level-reactive orb, status, caption and Mute / End controls.', 'Opened from the Call button.'] }),
  mk({ id: 'ury-brief-screen-settings', name: 'Screen: Brief settings', height: 844,
    render: (v) => b.briefScreen('ury-brief-screen-settings', `${underlay(v, 'ury-brief-screen-settings')}<div class="scrim"><div class="sheet" role="dialog" aria-modal="true" data-ui="ury-brief-screen-settings.sheet">${b.settingsBody(v, 'ury-brief-screen-settings')}</div></div>`, 'bf-settings'),
    describe: ['Settings sheet: Signed in as row, Appearance, Language for chat and calls and the play-button toggle.', 'Opened from the account menu.'] }),
];
