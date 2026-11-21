# Self-order category tabs (`ury-self-order-category-tabs`)

Sticky category chip row with a leading "All" chip.

**What:** Sticky horizontal category chip row (nav, bg-background/95, px-6 py-3, backdrop blur) with a leading "All" chip; rounded-full chips px-4 py-2 text-sm font-medium, active bg-primary, inactive border bg-background.

**When:** Use at the top of every self-order menu (tablet, kiosks, mobile). Rendered at 390 wide; it scrolls horizontally in the app so the last chips are clipped. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

Note: RTL is a kit extension (the URY self-order source has no dir handling); fixed UI labels are translated by the kit. Currency is a typed slot. Source: ury-erp/version-16 @100c43fe2e, self-order/src/layouts/shared.
