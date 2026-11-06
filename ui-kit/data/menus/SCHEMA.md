# Menu data schema (data/menus/<menu-id>.json)
Pre-populated, swappable demo data. UI components bind slots from these files; nothing is fetched at render time.

```json
{
  "id": "cafe",                       // = filename
  "name": {"en": "Brew & Bean Café", "ar": "optional"},
  "format": "cafe | qsr | fine-dine | casual | thali",
  "cuisine": "coffee",
  "defaultCurrency": "USD",           // must exist in data/universals/currencies.json
  "languages": ["en"],                // ["en","ar"] only when every name below has "ar"
  "categories": [ {"id":"espresso","name":{"en":"Espresso"},"icon":"optional"} ],
  "items": [
    {
      "id": "flat-white",             // unique, kebab-case, = image filename
      "category": "espresso",         // categories[].id
      "name": {"en": "Flat White"},   // add "ar" only for the Arabic-enabled menu
      "description": {"en": "short, <= 90 chars"},
      "prices": {"USD": 4.5, "EUR": 4.2, "INR": 280, "AED": 17, "SAR": 17, "QAR": 17},  // realistic per-currency, no FX maths at render
      "diet": "veg | non-veg | egg | vegan",
      "tags": ["hot","bestseller"],
      "station": "bar | grill | fryer | tandoor | cold | pastry | main",   // KOT routing
      "prepMinutes": 4,
      "image": "data/images/cafe/flat-white.jpg",   // REAL photograph, ~800px wide, <= 150KB
      "imageCredit": {"author":"","source":"Unsplash|Pexels|Wikimedia Commons|Pixabay","url":"page url","license":"e.g. Unsplash License / CC0 / CC BY 4.0 (include attribution)"}
    }
  ]
}
```
Rules: 25-30 items, 5-7 categories, every item has a REAL food photograph (never an SVG, illustration, AI image, placeholder or colour block). Photo must match the dish. Credits in `data/images/<menu-id>/CREDITS.md` too.
