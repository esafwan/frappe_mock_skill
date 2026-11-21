// Shared kiosk menu dataset (one menu, same names, prices and photos on every landscape and portrait kiosk screen).
// Photos: data/images/cafe/<img>.jpg (credits in data/images/cafe/CREDITS.md). Previews live in components/<id>/, state previews in components/<id>/states/.
export const CATS = ['Espresso', 'Milk Coffee', 'Black Coffee', 'Iced', 'Tea & Others'];
export const CATS_AR = ['إسبريسو', 'قهوة بالحليب', 'قهوة سوداء', 'مثلجات', 'شاي ومشروبات أخرى'];
// [name, Arabic name, rate (AED), category (1-based), photo file]
export const MENU = [
  ['Espresso', 'إسبريسو', 10, 1, 'espresso'], ['Doppio', 'دوبيو', 14, 1, 'doppio'], ['Macchiato', 'ماكياتو', 15, 1, 'macchiato'],
  ['Latte', 'لاتيه', 16, 2, 'latte'], ['Cappuccino', 'كابتشينو', 16, 2, 'cappuccino'], ['Flat White', 'فلات وايت', 17, 2, 'flat-white'],
  ['V60 Pour Over', 'قهوة مقطرة V60', 18, 3, 'pour-over'], ['Cold Brew', 'كولد برو', 19, 3, 'cold-brew'], ['Americano', 'أمريكانو', 12, 3, 'americano'],
  ['Iced Latte', 'لاتيه مثلج', 18, 4, 'iced-latte'], ['Iced Americano', 'أمريكانو مثلج', 15, 4, 'iced-americano'], ['Iced Mocha', 'موكا مثلجة', 20, 4, 'iced-mocha'],
  ['Masala Chai', 'شاي مسالا', 10, 5, 'chai-latte'], ['Green Tea', 'شاي أخضر', 9, 5, 'tea'], ['Hot Chocolate', 'شوكولاتة ساخنة', 14, 5, 'hot-chocolate'],
].map(([n, ar, r, cat, img]) => ({ n, ar, r, cat, img }));
export const LATTE = 3, CAPP = 4; // cart on every screen: Latte x1 + Cappuccino x2 = 3 items, 48.00
const dir = (depth) => '../'.repeat(depth) + 'data/images/cafe/';
// image slots: prefix(i) names the slot for menu index i; depth 2 = components/<id>/preview*.html, 3 = components/<id>/states/*.html
export const imgSlots = (prefix, depth = 2) => Object.fromEntries(MENU.map((m, i) => [prefix(i), { type: 'image', sample: dir(depth) + m.img + '.jpg' }]));
export const detailImg = (depth = 2) => ({ type: 'image', sample: dir(depth) + 'cappuccino.jpg' });
// every variant (rendered into states/) needs the deeper relative path
export const stateImages = (spec, prefix) => ({ ...spec, variants: Object.fromEntries(Object.entries(spec.variants || {}).map(([k, v]) => [k, { ...v, values: { ...imgSlots(prefix, 3), img: detailImg(3), ...(v.values || {}) } }])) });
