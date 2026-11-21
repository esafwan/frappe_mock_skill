# Self-order idle dialog (`ury-self-order-idle-dialog`)

"Still there?" idle-timeout dialog.

**What:** Idle-timeout dialog ("Still there?") shown by useIdleReset after 90 s without input: centred card on a blurred scrim, title and a full-width primary "I'm still here" button (py-3, text-base, font-medium).

**When:** Use on tablet and kiosk screens before the session resets. RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.

Note: RTL is a kit extension (the URY self-order source has no dir handling); fixed UI labels are translated by the kit. Currency is a typed slot. Source: ury-erp/version-16 @100c43fe2e, self-order/src/layouts/shared.
