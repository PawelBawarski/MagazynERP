---
description: 'Implement a StockFlow ERP feature using Angular 21 web and Electron desktop conventions.'
name: 'Implement StockFlow Feature'
argument-hint: 'Describe the feature and acceptance criteria'
agent: 'agent'
---

Implement the requested StockFlow feature: ${input:feature}

First inspect the current implementation and identify the relevant routes, components, API contracts, and tests. Follow the repository's Copilot instructions and load the relevant skill:

- Angular UI, routes, forms, state, or API integration: `angular-feature-development`
- Shared/feature state or NgRx architecture: `ngrx-state-management`
- Inventory, stock movements, users, roles, or permissions: `stockflow-domain`
- Invoices or financial behavior: `invoice-workflow`
- Electron main process or packaging: `electron-desktop`
- Mock API/data while no backend exists: `temporary-mock-backend`

Read `.github/instructions/ngrx.instructions.md` when touching a store or shared application state.

The application is version 0.0.1 with no backend; the future backend is planned in C#/.NET with PostgreSQL. Keep web/desktop features portable and isolate any temporary frontend mocks behind replaceable services. Use APIs supported by the installed Angular version. Do not invent business rules, role permissions, tax treatment, invoice numbering, or backend guarantees. Ask for clarification when an unresolved decision affects behavior or financial/security correctness.

Add a concise Polish JSDoc comment to every user-facing feature component. Describe actual user purpose and workflow so it can later support client documentation; keep it accurate and avoid undocumented claims. Implement the smallest complete change, add or update focused tests, run `npm run build` and the relevant tests, and summarize what changed, what was verified, and any remaining assumptions.
