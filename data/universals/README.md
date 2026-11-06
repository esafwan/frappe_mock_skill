# data/universals

Locale reference data for the UI kit (no backend). Frappe/ERPNext conventions.

- `currencies.json` - keyed by ISO code: names (en/ar), symbol, Arabic symbol, position, space, decimals (KWD/BHD/OMR 3, JPY 0), Frappe `numberFormat`, separators, fraction name, default locale.
- `languages.json` - keyed by language code: native name, rtl/dir, font stack, numeral system, date format, first day of week (0=Sunday).
- `locales.json` - presets keyed `"<locale>/<CURRENCY>"` (e.g. `ar-AE/AED`): language, currency, dir, date/time/number formats, timezone, VAT/tax label and rate.
- `i18n/en.json`, `i18n/ar.json` - Frappe-style `__("English")` strings; en keys equal values, ar holds translations. Same key set.
- `index.json` - file list and counts.

## Swapping
1. Pick a preset from `locales.json`, e.g. `ar-SA/SAR`.
2. Set `document.dir = preset.dir`; apply `languages[preset.language].fontStack`.
3. Format money with `currencies[preset.currency]` (symbol or symbolAr when language is ar, honour position/space/decimals/numberFormat).
4. Translate with `i18n/<language>.json`: `t = k => dict[k] ?? k`. Arabic numerals (`numeralSystem: arab`) are optional; Frappe shows Latin digits by default.
5. Apply `vat.rate` and `vat.label[language]` for tax lines.
