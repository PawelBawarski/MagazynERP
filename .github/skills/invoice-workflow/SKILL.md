---
name: invoice-workflow
description: 'Design or implement StockFlow invoices, invoice forms, totals, status transitions, payment tracking, or invoice permissions. Use whenever financial document behavior changes.'
---

# StockFlow invoice workflow

Use this workflow for invoice entry, review, issuance, correction, display, export, and payment-related changes.

1. Inspect the existing invoice model, API, permissions, persistence rules, and tests. Do not assume an invoice feature or backend exists just because it is planned.
2. Clarify invoice types, lifecycle/status transitions, numbering, currency, tax/VAT treatment, rounding, payment states, and applicable legal requirements before implementing them. Do not infer these rules from the interface language or locale.
3. Keep monetary calculations consistent with the authoritative API representation (decimal values or integer minor units); do not use binary floating-point for authoritative totals. Test rounding and boundary cases against the agreed rules.
4. Preserve an audit trail for issued documents. Do not silently overwrite issued invoice data; implement only the correction/credit process specified by the product requirements.
5. When a backend exists, enforce record access and actions there as well as in the UI. Until then, do not treat frontend-only implementations as authentication, authorization, or persistence. Verify permissions for listing, viewing, issuing, changing, and exporting records according to the approved permission matrix.
6. Minimize exposure of customer and financial data in logs, URLs, browser storage, and error messages. Present API failures clearly without disclosing sensitive details.
7. Add tests for totals, validation, lifecycle transitions, denied access, and API failure cases. Verify the frontend and backend responsibilities separately and run the relevant project build and tests.
8. Add a concise Polish JSDoc summary to each invoice feature component describing its user-visible purpose and confirmed workflow. Keep it suitable for later client documentation, update it when behavior changes, and do not put sensitive data or unconfirmed legal/financial rules in comments.
9. For any temporary mock API/data implementation before the planned C#/.NET + PostgreSQL backend exists, follow [the temporary mock-backend skill](../temporary-mock-backend/SKILL.md).
