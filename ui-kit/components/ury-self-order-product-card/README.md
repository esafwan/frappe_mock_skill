# Self-order product card (`ury-self-order-product-card`)

Menu item card with size scale (mobile, tablet, landscape, portrait) and availability variants (Sold out, Not available today, Temporarily unavailable, Currently unavailable).

**What:** Menu item button: bordered card with image (h-24 mobile, h-32 tablet, h-40 landscape, h-48 portrait), name (font-medium), rate (muted) and an "In cart: N" primary badge; rounded-lg on mobile, xl/2xl on kiosks. Unavailable items are opacity-50 with a destructive reason in place of the badge.

**When:** Use inside the menu grid. Currency is a typed slot: the source prints the raw server string, the kit uses a formatted currency. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

Note: RTL is a kit extension (the URY self-order source has no dir handling); fixed UI labels are translated by the kit. Currency is a typed slot. Source: ury-erp/version-16 @100c43fe2e, self-order/src/layouts/shared.
