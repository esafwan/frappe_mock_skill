#!/bin/bash
cd "$(dirname "$0")"
R="node render-doctype.mjs"; O=out
SI="fixtures/erpnext/sales_invoice.json --doc fixtures/samples/sales_invoice.doc.json --custom fixtures/india_compliance/custom_fields.json --meta-dir fixtures/erpnext"
$R $SI --out $O/sales_invoice.html
for t in 0 1 2 3 4 5; do $R $SI --tab $t --out $O/sales_invoice_tab$t.html | tail -1; done
$R fixtures/erpnext/customer.json --out $O/customer.html   # new form: comparable to live/customer.live.png
$R fixtures/erpnext/customer.json --doc fixtures/samples/customer.doc.json --out $O/customer_saved.html
$R fixtures/erpnext/item.json --custom fixtures/erpnext/item.custom_fields.json --out $O/item.html
$R fixtures/erpnext/company.json --custom fixtures/erpnext/company.custom_fields.json --out $O/company.html
$R fixtures/india_compliance/gst_settings.json --meta-dir fixtures/india_compliance/child --out $O/gst_settings.html
$R fixtures/erpgulf/zatca_erpgulf_setting.json --out $O/zatca_erpgulf_setting.html
$R fixtures/test/layout_test.json --out $O/layout_test.html
