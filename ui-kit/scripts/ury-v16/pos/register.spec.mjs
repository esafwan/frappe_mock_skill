// ury-pos static specs (T09): POS register route (order panel, full screen, empty cart, product dialog over register). 1440x900.
// Arabic: fixed UI labels from pos/src/i18n/locales/ar.json (cart.*, order_types.*, pos_sidebar.*, order.kot_*, common.all, menu.special_items).
// Variant and add-on names, customer name and menu items come from the mediterranean menu / sample data and are translated by hand.
import { STATE_NA } from '../lib.mjs';
import { REG_CSS, SCREEN_CSS, PRODUCT_CSS, KEYS, specSlots, hdr, hdrRtl, orderPanel, panelStage, registerScreen, registerProductScreen } from './register.mjs';
import { specs as dialogSpecs } from './dialogs.spec.mjs';

const base = { group: 'pos', static: true, dsf: 2, canvas: 'hsl(var(--background))', darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };
const na = { loading: 'the order-loading spinner is a transient state shown only while an existing order is fetched', error: 'errors surface as toasts, not inside the panel' };
const prod = dialogSpecs.find((s) => s.id === 'pos-product-dialog');

const panel = {
  ...base, id: 'pos-order-panel-v16', name: 'POS order panel (v16)', width: 384, height: 836, css: REG_CSS, ...specSlots(KEYS.panel),
  props: { lines: 'one' }, render: (v, p) => panelStage(orderPanel({ v, ...p })),
  describe: ['The 384px order panel of the POS register (OrderPanel.tsx): order-type pills, customer select, pax stepper, cart lines with edit, quantity stepper and delete, Clear cart, the comment button with Total and the full-width Add New Order button.', 'Pinned to the end edge of the register, 100vh minus 4rem tall; shows the running order while a server taps items. The empty cart is the pos-screen-register-empty screen.'],
  na, variants: {
    multi: { props: { lines: 'multi' }, describe: 'Saved order with four lines carrying KOT badges: Sent (red), Preparing (amber), Ready (blue) and Served (green).' },
    configured: { props: { lines: 'config' }, describe: 'A line with a chosen variant and add-ons under the name.' },
    'dine-in': { props: { lines: 'one', type: 'dine_in' }, describe: 'Dine In pill selected (primary-50 fill, primary-600 border).' },
    delivery: { props: { lines: 'one', type: 'delivery' }, describe: 'Delivery pill selected.' },
    'phone-in': { props: { lines: 'one', type: 'phone_in' }, describe: 'Phone In pill selected.' },
    aggregators: { props: { lines: 'one', type: 'aggregators' }, describe: 'Aggregators pill selected.' },
    'update-order': { props: { lines: 'multi', update: true, comment: true, customer: true, type: 'dine_in' }, describe: 'Editing a saved order: customer chosen, comment button in blue-600 and the Update Order button.' },
    disabled: { props: { lines: 'one', disabled: true }, state: 'disabled', describe: 'Dine In restricted for the user role: the pill is dimmed to 50%.' },
    empty: { props: { lines: 'empty' }, state: 'empty', describe: 'Empty cart: 96px gray-100 circle with a Frown, the Click items to add them chip and the double-click hint; no footer.' },
  },
};
const regSlots = specSlots(KEYS.screen, { slots: hdr(), rtl: hdrRtl() });
const screenBase = { ...base, width: 1440, height: 900, css: SCREEN_CSS, ...regSlots };
const reg = {
  ...screenBase, id: 'pos-screen-register', name: 'POS screen: register',
  props: {}, render: (v) => registerScreen({ v }),
  describe: ['The full POS register at 1440x900: header with Search Menu, 256px category sidebar, All and Special Items pills, a five-column menu grid on gray-50 and the 384px order panel over the footer navigation. One Hummus line is in the cart and its card shows the stepper.', 'Items, categories and prices bind to data/menus through bindings.json, so render.mjs --menu swaps the menu, language and currency.'],
  na, variants: {},
};
const empty = {
  ...screenBase, id: 'pos-screen-register-empty', name: 'POS screen: register, empty cart',
  props: {}, render: (v) => registerScreen({ v, lines: 'empty', id: 'pos-screen-register-empty' }),
  describe: ['The POS register with nothing in the order: no item steppers on the grid and the panel shows the Frown empty state with the double-click hint.', 'The first moment of a new order, before the first tap on a menu item.'],
  na, variants: {},
};
const product = {
  ...base, id: 'pos-screen-register-product', name: 'POS screen: register with product dialog', width: 1440, height: 900, css: PRODUCT_CSS,
  slots: { ...regSlots.slots, ...prod.slots }, rtlValues: { ...regSlots.rtlValues, ...prod.rtlValues },
  props: {}, render: (v) => registerProductScreen({ v }),
  describe: ['The product configurator dialog (pos-product-dialog) opened over the register after a double-click on a menu item: scrim over the sidebar, grid, order panel and header.', 'Used to show choosing variants, add-ons and a note before adding to the order.'],
  na, variants: {},
};
export const specs = [panel, reg, empty, product];
