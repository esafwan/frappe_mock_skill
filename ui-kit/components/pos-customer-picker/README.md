# pos-customer-picker

Customer picker (CustomerPicker.tsx wrapping packages/ui CustomerPicker): search field with a dropdown of matching customers (name, phone) and an Add New Customer row; a chosen customer shows as a card with a Change button; Add New opens the Add New Customer dialog (name, phone with country calling code, Add Customer / Cancel).

Used wherever a bill needs a customer: the order sidebar, the bill split dialog and checkout.

Source: pos/src/components (URY v16 @100c43fe2e). Styles: tokens/css/ury-v16/components/pos-dialogs.css. Variants: see states.json.
