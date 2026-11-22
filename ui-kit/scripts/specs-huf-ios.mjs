// HUF iOS (native SwiftUI app, iPhone 17 Pro, 402x874 pt): hand-authored HTML/CSS recreations, captured through the generic static
// spec source (scripts/static-capture.mjs). Sources: scripts/huf-mobile/ios/{lib,components,screens}.mjs. Ref simulator PNGs: systems/huf-ios/ref/.
import { defs } from './huf-mobile/ios/components.mjs';
import { screens } from './huf-mobile/ios/screens.mjs';
const CSS = ['huf-ios/huf-ios-fonts.css', 'huf-ios/huf-ios-tokens.css', 'huf-ios/huf-ios.css'];
const BASE = { group: 'huf-ios', static: true, width: 402, dsf: 3, css: CSS, darkTheme: 'dark', modes: ['light', 'dark'] };
export const specs = [
  ...defs.map((d) => ({ ...BASE, id: 'huf-ios-' + d.id, name: d.name, slots: d.slots, render: d.render, props: d.props || {}, variants: d.variants || {}, describe: d.describe, height: d.height && ['device-shell', 'empty-state', 'voice-sheet'].includes(d.id) ? d.height : undefined })),
  ...screens.map((s) => ({ ...BASE, id: 'huf-ios-screen-' + s.id, name: s.name, slots: s.slots, render: s.render, props: {}, variants: s.variants || {}, height: 874, describe: [s.name.replace('Screen: ', 'Full iPhone screen: '), 'Composed only from huf-ios components; use as a whole-screen mockup or video frame. Reference simulator capture: systems/huf-ios/ref/' + s.id + '.light.png.'] })),
];
