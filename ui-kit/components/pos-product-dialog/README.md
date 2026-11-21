# pos-product-dialog

Product configurator dialog of the POS (ProductDialog.tsx wrapping packages/ui ProductConfigurator): item image column, name, code and course, special-instruction input, quantity stepper, single-select variants, multi-select add-ons, running total and the Add to Order / Update Order button. Three equal columns inside a 90rem dialog, white surface.

Shown when a server taps a menu item that has variants or add-ons, or edits a line in the cart. Item name, price and image bind to menu.items[0] through bindings.json.

Source: pos/src/components (URY v16 @100c43fe2e). Styles: tokens/css/ury-v16/components/pos-dialogs.css. Variants: see states.json.
