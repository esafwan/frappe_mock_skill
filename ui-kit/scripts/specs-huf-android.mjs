// HUF Android (native Compose app, Pixel 5, 412x892 dp): hand-authored HTML/CSS recreations, captured through the generic static spec
// source (scripts/static-capture.mjs). Sources: scripts/huf-mobile/build-android{,-lib}.mjs. Ref emulator PNGs: systems/huf-android/ref/
// (`ref` = reference files per theme; null when the screen is authored from the Compose source).
import { C } from './huf-mobile/build-android-lib.mjs';
import { R, SCREENS } from './huf-mobile/build-android.mjs';
const CSS = ['huf-android/fonts.css', 'huf-android/tokens.css', 'huf-android/components.css'];
const BASE = { group: 'huf-android', static: true, width: 412, dsf: 2, css: CSS, darkTheme: 'dark', modes: ['light', 'dark'] };
const text = (c) => Object.fromEntries(Object.entries(c.slots).map(([k, s]) => [k, s.sample]));
const comps = Object.values(C).map((c) => {
  const short = c.id.replace('huf-android-', '');
  return { ...BASE, id: c.id, name: c.name, slots: c.pre ? {} : text(c), props: {}, screen: false, ref: null,
    render: (v, p) => (c.pre || c.root === 'device' ? R(short, p.over || (c.root === 'device' ? { content: '<div style="padding:60px 21px;color:var(--ha-secondary)">Screen body</div>' } : {})) : c.tpl),
    variants: Object.fromEntries(Object.entries(c.states || {}).map(([n, st]) => [n, { props: { over: st.slots }, values: st.slots, state: ({ pressed: 'active', loading: 'loading', busy: 'loading', failed: 'error' })[n], describe: st.note || n }])),
    describe: [c.name, c.desc], height: /sheet|menu|dialog|drawer/.test(c.id) ? 892 : undefined };
});
const screens = SCREENS.map((s) => ({ ...BASE, id: 'huf-android-screen-' + s.id, name: s.name, slots: {}, props: {}, variants: {}, screen: true, height: 892,
  ref: s.ref ? { light: s.refLightInvalid ? null : `systems/huf-android/ref/${s.ref}.light.png`, dark: `systems/huf-android/ref/${s.ref}.dark.png` } : null,
  render: () => R('device-shell', { content: s.body(), overlay: s.overlay ? s.overlay() : '' }).replace('data-ui="huf-android-device-shell"', `data-ui="huf-android-screen-${s.id}"`),
  describe: [s.name, 'Full Android screen composed from huf-android components (412x892 dp). ' + (s.ref ? 'Reference: systems/huf-android/ref/' + s.ref + '.*.png' : 'Authored from the Compose source; no emulator reference.')] }));
export const specs = [...comps, ...screens];
