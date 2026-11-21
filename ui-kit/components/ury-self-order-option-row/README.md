# Self-order option row (`ury-self-order-option-row`)

Variant / add-on option row, selected state border-primary bg-primary/10.

**What:** Variant or add-on option row from the product detail: flex justify-between rounded-lg border px-4 py-3; selected = border-primary bg-primary/10; rate in muted text, an em dash when the rate is null.

**When:** Use in the product detail screen under a "Variants" / "Add-ons" heading. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

Note: RTL is a kit extension (the URY self-order source has no dir handling); fixed UI labels are translated by the kit. Currency is a typed slot. Source: ury-erp/version-16 @100c43fe2e, self-order/src/layouts/shared.
