// Shared kiosk menu dataset (one menu, same names, prices and photos on every landscape and portrait kiosk screen).
// Photos: data/images/cafe/<img>.jpg (credits in data/images/cafe/CREDITS.md). Previews live in components/<id>/, state previews in components/<id>/states/.
export const CATS = ['Coffee', 'Iced', 'Tea & Others', 'Bakery', 'Breakfast'];
export const CATS_AR = ['قهوة', 'مثلجات', 'شاي ومشروبات أخرى', 'مخبوزات', 'فطور'];
// [name, Arabic name, rate (AED), category (1-based), photo file]; first items mix every category so the "All" view is not drinks only
export const MENU = [
  ['Espresso', 'إسبريسو', 10, 1, 'espresso'], ['Croissant', 'كرواسون', 12, 4, 'croissant'], ['Avocado Toast', 'توست أفوكادو', 24, 5, 'avocado-toast'],
  ['Latte', 'لاتيه', 16, 1, 'latte'], ['Cappuccino', 'كابتشينو', 16, 1, 'cappuccino'], ['Blueberry Muffin', 'مافن التوت الأزرق', 13, 4, 'blueberry-muffin'],
  ['Iced Latte', 'لاتيه مثلج', 18, 2, 'iced-latte'], ['Breakfast Sandwich', 'ساندويتش الفطور', 22, 5, 'breakfast-sandwich'], ['Cold Brew', 'كولد برو', 19, 2, 'cold-brew'],
  ['Masala Chai', 'شاي مسالا', 10, 3, 'chai-latte'], ['Cinnamon Roll', 'رول القرفة', 14, 4, 'cinnamon-roll'], ['Flat White', 'فلات وايت', 17, 1, 'flat-white'],
  ['Pancakes', 'بان كيك', 26, 5, 'pancakes'], ['Iced Americano', 'أمريكانو مثلج', 15, 2, 'iced-americano'], ['Hot Chocolate', 'شوكولاتة ساخنة', 14, 3, 'hot-chocolate'],
].map(([n, ar, r, cat, img]) => ({ n, ar, r, cat, img }));
export const LATTE = 3, CAPP = 4; // cart on every screen: Latte x1 + Cappuccino x2 = 3 items, 48.00
const dir = (depth) => '../'.repeat(depth) + 'data/images/cafe/';
// image slots: prefix(i) names the slot for menu index i; depth 2 = components/<id>/preview*.html, 3 = components/<id>/states/*.html
export const imgSlots = (prefix, depth = 2) => Object.fromEntries(MENU.map((m, i) => [prefix(i), { type: 'image', sample: dir(depth) + m.img + '.jpg' }]));
export const detailImg = (depth = 2) => ({ type: 'image', sample: dir(depth) + 'cappuccino.jpg' });
// every variant (rendered into states/) needs the deeper relative path
export const stateImages = (spec, prefix) => ({ ...spec, variants: Object.fromEntries(Object.entries(spec.variants || {}).map(([k, v]) => [k, { ...v, values: { ...imgSlots(prefix, 3), img: detailImg(3), ...(v.values || {}) } }])) });
