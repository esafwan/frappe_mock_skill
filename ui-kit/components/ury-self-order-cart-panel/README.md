# Self-order cart panel (`ury-self-order-cart-panel`)

Persistent order summary and cart aside (410 wide) with Place Order, Pay Online and Request Bill.

**What:** Persistent order-summary + cart aside (w-[32%], border-l, p-4): "Your order so far" block, "Cart" list with round −/+ steppers, tabular-nums total, Place Order, optional Pay Online / Request Bill.

**When:** Use on the tablet and landscape kiosk layouts; rendered at 410 wide. Amounts are typed currency slots (the source mixes raw server strings and formatCurrency). RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

Note: RTL is a kit extension (the URY self-order source has no dir handling); fixed UI labels are translated by the kit. Currency is a typed slot. Source: ury-erp/version-16 @100c43fe2e, self-order/src/layouts/shared.
